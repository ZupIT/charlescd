/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.CreateBuildInteractor
import br.com.zup.charles.application.build.request.CreateBuildRequest
import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.FeatureSnapshot
import br.com.zup.charles.domain.Hypothesis
import br.com.zup.charles.domain.User
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.domain.repository.HypothesisRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.charles.domain.service.GitProviderService
import br.com.zup.charles.domain.service.VillagerService
import br.com.zup.darwin.commons.constants.ColumnConstants
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import java.util.*
import javax.inject.Inject
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateBuildInteractorImpl @Inject constructor(
    private val gitProviderService: GitProviderService,
    private val userRepository: UserRepository,
    private val buildRepository: BuildRepository,
    private val hypothesisRepository: HypothesisRepository,
    private val villagerService: VillagerService
) : CreateBuildInteractor {

    @Transactional
    override fun execute(request: CreateBuildRequest, applicationId: String): BuildResponse {
        val hypothesis = findHypothesis(request)
        val build = createBuildEntity(request, hypothesis, applicationId)
        this.buildRepository.save(build)
        this.gitProviderService.createReleaseCandidates(build)
        this.villagerService.build(build)

        return BuildResponse.from(build)
    }

    private fun createBuildEntity(request: CreateBuildRequest, hypothesis: Hypothesis, applicationId: String): Build {
        val user = findAuthor(request.authorId)

        val buildId = UUID.randomUUID().toString()

        return request.toBuild(
            id = buildId,
            user = user,
            features = findBuildFeatures(hypothesis, request, buildId),
            applicationId = applicationId,
            columnId = hypothesis.findColumnByName(ColumnConstants.BUILDS_COLUMN_NAME).id
        )
    }

    private fun findBuildFeatures(
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

    private fun findAuthor(authorId: String): User {
        return this.userRepository.findById(
            authorId
        ).orElseThrow {
            NotFoundException(
                ResourceValue("user", authorId)
            )
        }
    }

    private fun findHypothesis(request: CreateBuildRequest): Hypothesis {
        return this.hypothesisRepository.findById(
            request.hypothesisId
        ).orElseThrow {
            NotFoundException(
                ResourceValue("hypothesis", request.hypothesisId)
            )
        }
    }
}