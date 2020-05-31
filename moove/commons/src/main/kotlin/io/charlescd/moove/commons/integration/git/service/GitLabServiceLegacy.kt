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
import io.charlescd.moove.commons.integration.git.factory.GitLabClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.model.CompareResult
import io.charlescd.moove.legacy.repository.entity.GitCredentials
import io.charlescd.moove.legacy.repository.entity.GitServiceProvider
import org.gitlab4j.api.Constants
import org.gitlab4j.api.GitLabApi
import org.gitlab4j.api.GitLabApiException
import org.gitlab4j.api.models.MergeRequest
import org.gitlab4j.api.models.MergeRequestFilter
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*

@Component
class GitLabServiceLegacy(private val gitLabClientFactoryLegacy: GitLabClientFactoryLegacy) : GitServiceLegacy() {

    private val log = LoggerFactory.getLogger(this.javaClass)
    private val UNABLE_TO_MERGE = "cannot_be_merged"

    override fun mergeBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ) {
        log.info("attempting to merge branch: $headBranch into $baseBranch on GitLab repository: $repository")
        try {
            val client = getClient(gitCredentials)
            val mergeRequests = client.mergeRequestApi.getMergeRequests(MergeRequestFilter().apply {
                sourceBranch = headBranch
                targetBranch = baseBranch
                state = Constants.MergeRequestState.OPENED

            })
            if (mergeRequests.isEmpty()) {
                val mergeRequest = client.mergeRequestApi.createMergeRequest(
                    repository,
                    headBranch,
                    baseBranch,
                    "MERGE $headBranch into $baseBranch",
                    COMMIT_MESSAGE,
                    null
                )
                verifyMergeability(mergeRequest)
                client.mergeRequestApi.acceptMergeRequest(repository, mergeRequest.iid)
            } else {
                verifyMergeability(mergeRequests.first())
                client.mergeRequestApi.acceptMergeRequest(repository, mergeRequests.first().iid)
            }
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
        log.info("attempting to create new branch on GitLab repository: $repository from base: $baseBranchName and with name: $branchName")
        return try {
            Optional.of(
                getClient(gitCredentials).repositoryApi.createBranch(repository, branchName, baseBranchName)
                    .name
            ).also { log.info("new branch: $branchName created successfully") }
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
        log.info("attempting to create new release on GitLab repository: $repository from base: $sourceBranch and with name: $releaseName")
        return try {
            val client = getClient(gitCredentials)
            val tag = client.tagsApi.createTag(repository, releaseName, sourceBranch, RELEASE_DESCRIPTION, "")
            Optional.of(client.tagsApi.createRelease(repository, tag.name, RELEASE_DESCRIPTION).tagName).apply {
                log.info("release: $releaseName created successfully")
            }
        } catch (e: Exception) {
            log.error("failed to create release: $releaseName with error: ${e.message}")
            handleResponseError(
                error = e,
                repository = repository,
                releaseName = releaseName,
                baseBranch = sourceBranch
            )
            Optional.empty()
        }
    }

    override fun findRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String
    ): Optional<String> {
        log.info("searching for release: $releaseName into GitLab repository: $repository")
        return try {
            Optional.of(getClient(gitCredentials).tagsApi.getTag(repository, releaseName).release.tagName).also {
                log.info("found release: $releaseName into GitLab repository: $repository")
            }
        } catch (e: Exception) {
            log.error("failed to find release: $releaseName with error: ${e.message}")
            handleResponseError(error = e, repository = repository, releaseName = releaseName)
            Optional.empty()
        }
    }

    override fun findBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String
    ): Optional<String> {
        log.info("searching for branch: $branchName into GitLab repository: $repository")
        return try {
            Optional.of(getClient(gitCredentials).repositoryApi.getBranch(repository, branchName).name)
        } catch (e: Exception) {
            log.error("failed to find branch: $branchName with error: ${e.message}")
            handleResponseError(error = e, repository = repository, branchName = branchName)
            Optional.empty()
        }
    }

    override fun deleteBranch(gitCredentials: GitCredentials, repository: String, branchName: String) {
        log.info("deleting branch: $branchName from GitLab repository: $repository")
        try {
            getClient(gitCredentials).repositoryApi.deleteBranch(repository, branchName)
            log.info("branch: $branchName successfully deleted from GitLab repository: $repository")
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
            log.info("comparing head: $headBranch with base: $baseBranch on GitLab repository: $repository")
            getClient(gitCredentials).repositoryApi.compare(repository, baseBranch, headBranch).let {
                CompareResult(repository, baseBranch, headBranch, 0, it.commits.size)
            }
        } catch (e: Exception) {
            log.error("error comparing head: $headBranch with base: $baseBranch on GitLab repository: $repository")
            handleResponseError(error = e, repository = repository, baseBranch = baseBranch, headBranch = headBranch)
            CompareResult(repository, baseBranch, headBranch, 0, 0)
        }
    }

    override fun getProviderType(): GitServiceProvider = GitServiceProvider.GITLAB

    private fun handleResponseError(
        error: Exception,
        branchName: String = "",
        repository: String = "",
        headBranch: String = "",
        baseBranch: String = "",
        releaseName: String = ""
    ) {
        when {
            isNotFoundError(error) && containsErrorMessage(
                error,
                "404 Branch Not Found"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND)
                .withParameters(branchName)

            isNotFoundError(error) && containsErrorMessage(
                error,
                "404 Tag Not Found"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_TAG_NOT_FOUND)
                .withParameters(releaseName)

            isNotFoundError(error) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND)
                .withParameters(repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Branch already exists"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_BRANCH)
                .withParameters(branchName, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Invalid reference name"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND)
                .withParameters(baseBranch, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Target $baseBranch is invalid"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND)
                .withParameters(releaseName, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Tag $releaseName already exists"
            ) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_TAG)
                .withParameters(releaseName, repository)

            isConflictError(error) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_MERGE_CONFLICT)
                .withParameters(headBranch, baseBranch, repository)

            isMethodNotAllowedError(error) && containsErrorMessage(error, "Method Not Allowed") ->
                throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_MERGE_ERROR)
                    .withParameters(repository)

            isForbiddenError(error) -> throw BusinessExceptionLegacy.of(MooveErrorCodeLegacy.GIT_ERROR_FORBIDDEN)
                .withParameters(repository)

            error is GitLabApiException -> throw BusinessExceptionLegacy.of(
                MooveErrorCodeLegacy.GIT_INTEGRATION_ERROR,
                error.message!!
            )

            else -> throw RuntimeException(error)
        }
    }

    private fun isNotFoundError(error: Exception): Boolean = error is GitLabApiException && error.httpStatus == 404

    private fun isMethodNotAllowedError(error: Exception): Boolean =
        error is GitLabApiException && error.httpStatus == 405

    private fun isConflictError(error: Exception): Boolean = error is GitLabApiException && error.httpStatus == 409

    private fun isClientError(error: Exception): Boolean = error is GitLabApiException && error.httpStatus == 400

    private fun isForbiddenError(error: Exception): Boolean = error is GitLabApiException && error.httpStatus == 403

    private fun verifyMergeability(mergeRequest: MergeRequest) {
        if (mergeRequest.mergeStatus == UNABLE_TO_MERGE) {
            throw GitLabApiException("Conflict", 409)
        }
    }

    private fun getClient(gitCredentials: GitCredentials): GitLabApi =
        gitLabClientFactoryLegacy.buildGitClient(gitCredentials)
}
