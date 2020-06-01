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

package io.charlescd.moove.commons.integration.git.service

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.integration.git.extension.createRelease
import io.charlescd.moove.commons.integration.git.extension.deleteBranch
import io.charlescd.moove.commons.integration.git.extension.findReleaseByTagName
import io.charlescd.moove.commons.integration.git.extension.mergeBranches
import io.charlescd.moove.commons.integration.git.factory.GitHubClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.model.CompareResult
import io.charlescd.moove.legacy.repository.entity.GitCredentials
import io.charlescd.moove.legacy.repository.entity.GitServiceProvider
import java.util.*
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.RepositoryId
import org.eclipse.egit.github.core.client.GitHubClient
import org.eclipse.egit.github.core.client.RequestException
import org.eclipse.egit.github.core.service.CommitService
import org.eclipse.egit.github.core.service.DataService
import org.eclipse.egit.github.core.service.RepositoryService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class GitHubServiceLegacy(private val gitHubClientFactoryLegacy: GitHubClientFactoryLegacy) : GitServiceLegacy() {

    private val log = LoggerFactory.getLogger(this.javaClass)
    private val branchPrefix = "refs/heads/"

    override fun mergeBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ) {
        log.info("attempting to merge branch: $headBranch into $baseBranch on GitHub repository: $repository")
        try {
            RepositoryService(getClient(gitCredentials)).mergeBranches(
                repository, baseBranch, headBranch,
                COMMIT_MESSAGE
            )
            log.info("branch: $headBranch successfully merged into branch: $baseBranch")
        } catch (e: Exception) {
            log.error("failed to merge branch: $headBranch into branch: $baseBranch with error: ${e.message}")
            handleResponseError(error = e, repository = repository, baseBranch = baseBranch, headBranch = headBranch)
        }
    }

    override fun createBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String,
        baseBranchName: String
    ): Optional<String> {
        log.info("attempting to create new branch on GitHub repository: $repository from base: $baseBranchName and with name: $branchName")
        val repositoryId = RepositoryId.createFromId(repository)
        val service = DataService(getClient(gitCredentials))
        return try {
            val baseBranch = findBranchByName(service, repositoryId, baseBranchName)
            Optional.of(service.createReference(repositoryId, Reference()
                .apply { `object` = baseBranch.`object` }
                .apply { ref = "$branchPrefix$branchName" }).ref.substringAfter(branchPrefix)
            )
                .also { log.info("new branch: $branchName created successfully") }
        } catch (e: Exception) {
            log.error("failed to create branch: $branchName with error: ${e.message}")
            handleResponseError(
                error = e,
                repository = repository,
                baseBranch = baseBranchName,
                branchName = branchName
            )
            Optional.empty()
        }
    }

    override fun createRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String,
        sourceBranch: String,
        description: String
    ): Optional<String> {
        log.info("attempting to create new release on GitHub repository: $repository from base: $sourceBranch and with name: $releaseName")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        return try {
            Optional.of(
                repositoryService.createRelease(repository, sourceBranch, releaseName, description).get("name")
                    .asString
            ).apply {
                log.info("release: $releaseName created successfully")
            }
        } catch (e: Exception) {
            log.error("failed to create release: $releaseName with error: ${e.message}")
            handleResponseError(
                error = e,
                repository = repository,
                baseBranch = sourceBranch,
                releaseName = releaseName
            )
            Optional.empty()
        }
    }

    override fun findRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String
    ): Optional<String> {
        log.info("searching for release: $releaseName into GitHub repository: $repository")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        return try {
            Optional.of(repositoryService.findReleaseByTagName(repository, releaseName).get("name").asString).also {
                log.info("found release: $releaseName into GitHub repository: $repository")
            }
        } catch (e: Exception) {
            log.error("failed to find release: $releaseName with error: ${e.message}")
            handleReleaseNotFound(e, releaseName)
            handleResponseError(error = e, repository = repository, releaseName = releaseName)
            Optional.empty()
        }
    }

    override fun findBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String
    ): Optional<String> {
        log.info("searching for branch: $branchName into GitHub repository: $repository")
        val client = getClient(gitCredentials)
        val dataService = DataService(client)
        return try {
            Optional.of(
                findBranchByName(
                    dataService,
                    RepositoryId.createFromId(repository),
                    branchName
                ).ref.substringAfter(branchPrefix)
            )
        } catch (e: Exception) {
            log.error("failed to find branch: $branchName with error: ${e.message}")
            handleResponseError(error = e, repository = repository, branchName = branchName)
            Optional.empty()
        }
    }

    override fun getProviderType(): GitServiceProvider = GitServiceProvider.GITHUB

    override fun deleteBranch(gitCredentials: GitCredentials, repository: String, branchName: String) {
        log.info("deleting branch: $branchName from GitHub repository: $repository")
        val client = getClient(gitCredentials)
        try {
            RepositoryService(client).deleteBranch(repository, branchName)
            log.info("branch: $branchName successfully deleted from GitHub repository: $repository")
        } catch (e: Exception) {
            log.error("error trying to delete branch: $branchName from GitHub repository: $repository")
            handleResponseError(e, branchName, repository)
        }
    }

    override fun compareBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ): CompareResult {
        return try {
            log.info("comparing head: $headBranch with base: $baseBranch on GitHub repository: $repository")
            CommitService(getClient(gitCredentials)).compare(
                RepositoryId.createFromId(repository),
                "$branchPrefix$baseBranch",
                "$branchPrefix$headBranch"
            ).let { CompareResult(repository, baseBranch, headBranch, it.aheadBy, it.behindBy) }
        } catch (e: Exception) {
            log.error("error comparing head: $headBranch with base: $baseBranch on GitHub repository: $repository")
            handleResponseError(error = e, repository = repository, baseBranch = baseBranch, headBranch = headBranch)
            CompareResult(repository, baseBranch, headBranch, 0, 0)
        }
    }

    private fun findBranchByName(service: DataService, repositoryId: RepositoryId, branchName: String): Reference {
        return try {
            service.getReference(repositoryId, "$branchPrefix$branchName")
        } catch (e: RequestException) {
            throw if (e.status == 404) {
                BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND)
                    .withParameters(branchName, repositoryId.toString())
            } else {
                e
            }
        }
    }

    private fun handleResponseError(
        error: Exception,
        branchName: String = "",
        repository: String = "",
        headBranch: String = "",
        baseBranch: String = "",
        releaseName: String = ""
    ) {
        when {
            isNotFoundError(error) && containsErrorMessage(error, "Base does not exist") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND)
                    .withParameters(baseBranch, repository)

            isNotFoundError(error) && containsErrorMessage(error, "Head does not exist") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_HEAD_NOT_FOUND)
                    .withParameters(headBranch, repository)

            isNotFoundError(error) -> repositoryNotFound(repository)

            isConflictError(error) && containsErrorMessage(error, "Merge conflict") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_MERGE_CONFLICT)
                    .withParameters(headBranch, baseBranch, repository)

            isUnprocessableError(error) && containsErrorMessage(error, "(Tag Already Exists)") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_TAG)
                    .withParameters(releaseName, repository)

            isUnprocessableError(error) && containsErrorMessage(error, "Reference already exists") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_BRANCH)
                    .withParameters(branchName, repository)

            isUnprocessableError(error) && containsErrorMessage(error, "Reference does not exist") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND)
                    .withParameters(branchName, repository)

            isUnprocessableError(error) && containsErrorMessage(error, "Invalid value for 'target_commitish' field") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND)
                    .withParameters(branchName, repository)

            error is RequestException -> throw BusinessExceptionLegacy.of(
                MooveErrorCodeLegacy.GIT_INTEGRATION_ERROR,
                error.message!!
            )

            error is BusinessExceptionLegacy -> throw error

            else -> throw RuntimeException(error)
        }
    }

    private fun isNotFoundError(error: Exception): Boolean = error is RequestException && error.status == 404

    private fun isConflictError(error: Exception): Boolean = error is RequestException && error.status == 409

    private fun isUnprocessableError(error: Exception): Boolean = error is RequestException && error.status == 422

    private fun handleReleaseNotFound(e: Exception, releaseName: String) {
        if (isNotFoundError(e)) {
            throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_TAG_NOT_FOUND).withParameters(releaseName)
        }
    }

    private fun repositoryNotFound(repository: String) {
        throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND).withParameters(repository)
    }

    private fun getClient(gitConfiguration: GitCredentials): GitHubClient =
        gitHubClientFactoryLegacy.buildGitClient(gitConfiguration)
}
