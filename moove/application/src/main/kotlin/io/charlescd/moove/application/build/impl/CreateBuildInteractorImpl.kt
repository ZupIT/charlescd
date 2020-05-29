/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.*
import io.charlescd.moove.application.build.CreateBuildInteractor
import io.charlescd.moove.application.build.request.CreateBuildRequest
import io.charlescd.moove.application.build.response.BuildResponse
import io.charlescd.moove.commons.constants.ColumnConstants
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.GitProviderService
import io.charlescd.moove.domain.service.VillagerService
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateBuildInteractorImpl @Inject constructor(
    private val gitProviderService: GitProviderService,
    private val userService: UserService,
    private val buildService: BuildService,
    private val hypothesisService: HypothesisService,
    private val villagerService: VillagerService,
    private val workspaceService: WorkspaceService,
    private val gitConfigurationService: GitConfigurationService
) : CreateBuildInteractor {

    @Transactional
    override fun execute(request: CreateBuildRequest, workspaceId: String): BuildResponse {
        val workspace = workspaceService.find(workspaceId)
        validateWorkspace(workspace)
        val hypothesis = hypothesisService.find(request.hypothesisId)
        val build = createBuildEntity(request, hypothesis, workspaceId)
        buildService.save(build)
        createReleaseCandidate(build, workspace)
        sendBuildInformationToVillager(build, workspace)

        return BuildResponse.from(build)
    }

    private fun validateWorkspace(workspace: Workspace) {
        workspace.gitConfigurationId
            ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_GIT_CONFIGURATION_IS_MISSING)
        workspace.registryConfigurationId
            ?: throw BusinessException.of(MooveErrorCode.WORKSPACE_DOCKER_REGISTRY_CONFIGURATION_IS_MISSING)
    }

    private fun sendBuildInformationToVillager(
        build: Build,
        workspace: Workspace
    ) {
        this.villagerService.build(build, workspace.registryConfigurationId!!)
    }

    private fun createReleaseCandidate(
        build: Build,
        workspace: Workspace
    ) {
        this.gitProviderService.createReleaseCandidates(
            build,
            gitConfigurationService.find(workspace.gitConfigurationId!!).credentials
        )
    }

    private fun createBuildEntity(request: CreateBuildRequest, hypothesis: Hypothesis, workspaceId: String): Build {
        val user = userService.find(request.authorId)

        val buildId = UUID.randomUUID().toString()

        return request.toBuild(
            id = buildId,
            user = user,
            features = findBuildFeatures(hypothesis, request, buildId),
            workspaceId = workspaceId,
            columnId = hypothesis.findColumnByName(ColumnConstants.BUILDS_COLUMN_NAME).id
        )
    }

    private fun findBuildFeatures(
        hypothesis: Hypothesis,
        request: CreateBuildRequest,
        buildId: String
    ): List<FeatureSnapshot> {
        val features = findReadyToGoFeatures(hypothesis, request, buildId)

        if (features.isEmpty() || request.features.size != features.size) {
            throw BusinessException.of(
                MooveErrorCode.SOME_OF_INFORMED_FEATURES_DOES_NOT_EXIST_OR_ARE_NOT_READY_TO_GO
            )
        }

        return features
    }

    private fun findReadyToGoFeatures(
        hypothesis: Hypothesis,
        request: CreateBuildRequest,
        buildId: String
    ): List<FeatureSnapshot> {
        return hypothesis.findFeaturesByColumnName(
            ColumnConstants.READY_TO_GO_COLUMN_NAME
        ).filter {
            request.features.contains(it.id)
        }.map {
            FeatureSnapshot.from(UUID.randomUUID().toString(), buildId, it)
        }
    }
}
