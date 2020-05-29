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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.GitProviderService
import io.charlescd.moove.domain.service.GitService
import io.charlescd.moove.infrastructure.mapper.GitServiceMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*

@Component
class GitHubProviderService(
    private val gitServiceMapper: GitServiceMapper
) : GitProviderService {

    companion object {
        const val INTERMEDIARY_BRANCH_PREFIX = "intermediary-"
    }

    private val logger = LoggerFactory.getLogger(this.javaClass)

    override fun createReleaseCandidates(build: Build, credentials: GitCredentials) {
        val intermediaryBranches = mutableMapOf<String, String>()
        val releaseBranches = mutableMapOf<String, String>()

        val modules = extractModules(build)

        createIntermediaryBranches(modules, build, credentials, intermediaryBranches)

        mergeFeaturesOnIntermediaryBranches(build, credentials, intermediaryBranches)

        createFinalReleaseBranches(modules, build, credentials, intermediaryBranches, releaseBranches)

        createReleaseCandidates(modules, credentials, releaseBranches)

        deleteIntermediaryBranches(modules, credentials, intermediaryBranches)
    }

    private fun createReleaseCandidates(
        modules: List<ModuleSnapshot>,
        credentials: GitCredentials,
        releaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createReleaseCandidate(
                module,
                credentials,
                releaseBranches
            )
        }
    }

    private fun deleteIntermediaryBranches(
        modules: List<ModuleSnapshot>,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            deleteIntermediaryReleaseCandidateBranch(
                module,
                credentials,
                intermediaryReleaseBranches
            )
        }
    }

    private fun createFinalReleaseBranches(
        modules: List<ModuleSnapshot>,
        build: Build,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>,
        releaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createFinalReleaseCandidateBranch(
                build,
                module,
                credentials,
                intermediaryReleaseBranches,
                releaseBranches
            )
        }
    }

    private fun mergeFeaturesOnIntermediaryBranches(
        build: Build,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        build.features.forEach { feature ->
            mergeFeatureBranchesOnIntermediaryReleaseCandidateBranch(
                feature,
                credentials,
                intermediaryReleaseBranches
            )
        }
    }

    private fun createIntermediaryBranches(
        modules: List<ModuleSnapshot>,
        build: Build,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createIntermediaryReleaseCandidateBranch(
                build,
                module,
                credentials,
                intermediaryReleaseBranches
            )
        }
    }

    private fun extractModules(build: Build): List<ModuleSnapshot> {
        return build.features.flatMap { feature ->
            feature.modules
        }.distinct()
    }

    private fun createIntermediaryReleaseCandidateBranch(
        build: Build,
        module: ModuleSnapshot,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        val intermediaryBranchName = INTERMEDIARY_BRANCH_PREFIX + build.tag
        try {
            gitServiceMapper.getByType(credentials.serviceProvider)
                .createBranch(credentials, module.name, intermediaryBranchName)
        } catch (exception: Exception) {
            handleException(exception, intermediaryBranchName)
        } finally {
            intermediaryReleaseBranches[module.name] = intermediaryBranchName
        }
    }

    private fun mergeFeatureBranchesOnIntermediaryReleaseCandidateBranch(
        feature: FeatureSnapshot,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        feature.modules.forEach { module ->
            val gitService = gitServiceMapper.getByType(credentials.serviceProvider)
            gitService.mergeBranches(
                credentials,
                module.name,
                intermediaryReleaseBranches.getValue(module.name),
                feature.branchName
            )
        }
    }

    private fun createFinalReleaseCandidateBranch(
        build: Build,
        module: ModuleSnapshot,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>,
        releaseBranches: MutableMap<String, String>
    ) {
        try {
            gitServiceMapper.getByType(credentials.serviceProvider).createBranch(
                credentials,
                module.name,
                build.tag,
                intermediaryReleaseBranches.getValue(module.name)
            )
        } catch (e: Exception) {
            handleException(e, build.tag)
        } finally {
            releaseBranches[module.name] = build.tag
        }
    }

    private fun createReleaseCandidate(
        module: ModuleSnapshot,
        credentials: GitCredentials,
        releaseBranches: MutableMap<String, String>
    ) {
        val gitService = gitServiceMapper.getByType(credentials.serviceProvider)

        findRelease(gitService, credentials, module, releaseBranches).orElseGet {
            gitService.createRelease(
                credentials,
                module.name,
                releaseBranches.getValue(module.name),
                releaseBranches.getValue(module.name)
            ).get()
        }
    }

    private fun findRelease(
        gitService: GitService,
        credentials: GitCredentials,
        module: ModuleSnapshot,
        releaseBranches: MutableMap<String, String>
    ): Optional<String> {
        return try {
            gitService.findRelease(
                credentials,
                module.name,
                releaseBranches.getValue(module.name)
            )
        } catch (e: BusinessException) {
            Optional.empty()
        }
    }

    private fun deleteIntermediaryReleaseCandidateBranch(
        module: ModuleSnapshot,
        credentials: GitCredentials,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        try {
            gitServiceMapper.getByType(credentials.serviceProvider).deleteBranch(
                credentials,
                module.name,
                intermediaryReleaseBranches.getValue(module.name)
            )
        } catch (exception: Exception) {
            when {
                branchDoesNotExists(exception) -> logger.warn(
                    "Branch: ${intermediaryReleaseBranches[module.name]} does not exists"
                )
                else -> throw exception
            }
        }
    }

    private fun handleException(exception: Exception, branchName: String = String()) {
        when {
            branchAlreadyExists(exception) -> logger.warn(
                "Branch: $branchName already exists"
            )
            else -> throw exception
        }
    }

    private fun branchAlreadyExists(exception: Exception): Boolean {
        return exception is BusinessException &&
                MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH == exception.getErrorCode()
    }

    private fun branchDoesNotExists(exception: Exception): Boolean {
        return exception is BusinessException &&
                MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND == exception.getErrorCode()
    }
}
