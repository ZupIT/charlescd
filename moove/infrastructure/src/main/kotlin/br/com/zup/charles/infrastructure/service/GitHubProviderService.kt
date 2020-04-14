/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.FeatureSnapshot
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.ModuleSnapshot
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import br.com.zup.charles.domain.service.GitProviderService
import br.com.zup.charles.domain.service.GitService
import br.com.zup.charles.infrastructure.CharlesErrorCode
import br.com.zup.charles.infrastructure.mapper.GitServiceMapper
import br.com.zup.exception.handler.exception.BusinessException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*
import kotlin.collections.HashMap

@Component
class GitHubProviderService(
    private val gitConfigurationRepository: GitConfigurationRepository,
    private val gitServiceMapper: GitServiceMapper
) : GitProviderService {

    companion object {
        const val INTERMEDIARY_BRANCH_PREFIX = "intermediary-"
    }

    private val logger = LoggerFactory.getLogger(this.javaClass)

    override fun createReleaseCandidates(build: Build) {
        val intermediaryBranches = mutableMapOf<String, String>()
        val releaseBranches = mutableMapOf<String, String>()

        val modules = extractModules(build)
        val credentials = fetchCredentials(build.features.flatMap { it.modules })

        createIntermediaryBranches(modules, build, credentials, intermediaryBranches)

        mergeFeaturesOnIntermediaryBranches(build, credentials, intermediaryBranches)

        createFinalReleaseBranches(modules, build, credentials, intermediaryBranches, releaseBranches)

        createReleaseCandidates(modules, credentials, releaseBranches)

        deleteIntermediaryBranches(modules, credentials, intermediaryBranches)
    }

    private fun createReleaseCandidates(
        modules: List<ModuleSnapshot>,
        credentials: MutableMap<String, GitCredentials>,
        releaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createReleaseCandidate(
                module,
                credentials.getValue(module.gitConfigurationId),
                releaseBranches
            )
        }
    }

    private fun deleteIntermediaryBranches(
        modules: List<ModuleSnapshot>,
        credentials: MutableMap<String, GitCredentials>,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            deleteIntermediaryReleaseCandidateBranch(
                module,
                credentials.getValue(module.gitConfigurationId),
                intermediaryReleaseBranches
            )
        }
    }

    private fun createFinalReleaseBranches(
        modules: List<ModuleSnapshot>,
        build: Build,
        credentials: MutableMap<String, GitCredentials>,
        intermediaryReleaseBranches: MutableMap<String, String>,
        releaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createFinalReleaseCandidateBranch(
                build,
                module,
                credentials.getValue(module.gitConfigurationId),
                intermediaryReleaseBranches,
                releaseBranches
            )
        }
    }

    private fun mergeFeaturesOnIntermediaryBranches(
        build: Build,
        credentials: MutableMap<String, GitCredentials>,
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
        credentials: MutableMap<String, GitCredentials>,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        modules.forEach { module ->
            createIntermediaryReleaseCandidateBranch(
                build,
                module,
                credentials.getValue(module.gitConfigurationId),
                intermediaryReleaseBranches
            )
        }
    }

    private fun extractModules(build: Build): List<ModuleSnapshot> {
        return build.features.flatMap { feature ->
            feature.modules
        }.distinct()
    }

    private fun fetchCredentials(modules: List<ModuleSnapshot>): MutableMap<String, GitCredentials> {

        val credentials = findCredentials(modules)

        val configurationIds = modules.map { it.gitConfigurationId }

        return if (credentials.keys.containsAll(configurationIds)) {
            credentials
        } else {
            throw BusinessException.of(
                CharlesErrorCode.GIT_CREDENTIALS_NOT_FOUND
            )
        }
    }

    private fun findCredentials(modules: List<ModuleSnapshot>): HashMap<String, GitCredentials> {

        val credentials = HashMap<String, GitCredentials>()

        modules.forEach { module ->
            val configuration = gitConfigurationRepository.findById(module.gitConfigurationId)

            configuration.map {
                credentials.putIfAbsent(module.gitConfigurationId, it.credentials)
            }
        }

        return credentials
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
        credentialsMap: MutableMap<String, GitCredentials>,
        intermediaryReleaseBranches: MutableMap<String, String>
    ) {
        feature.modules.forEach { module ->
            val credentials = credentialsMap.getValue(module.gitConfigurationId)
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
                CharlesErrorCode.GIT_ERROR_DUPLICATED_BRANCH.toString() == exception.errorCode.toString()
    }

    private fun branchDoesNotExists(exception: Exception): Boolean {
        return exception is BusinessException &&
                CharlesErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString() == exception.errorCode.toString()
    }
}