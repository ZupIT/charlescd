package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.CompareResult
import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.service.GitService
import java.util.*
import org.gitlab4j.api.Constants
import org.gitlab4j.api.GitLabApi
import org.gitlab4j.api.GitLabApiException
import org.gitlab4j.api.models.MergeRequest
import org.gitlab4j.api.models.MergeRequestFilter
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class GitLabService(private val gitLabClientFactoryLegacy: GitLabClientFactory) : GitService() {

    private val log = LoggerFactory.getLogger(this.javaClass)
    private val UNABLE_TO_MERGE = "cannot_be_merged"

    override fun mergeBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ) {
        log.info("Attempting to merge branch: $headBranch into $baseBranch on GitLab repository: $repository")
        try {
            val client = getClient(gitCredentials)
            val mergeRequests = client.mergeRequestApi.getMergeRequests(MergeRequestFilter().apply {
                sourceBranch = headBranch
                targetBranch = baseBranch
                state = Constants.MergeRequestState.OPENED
            })

            if (mergeRequests.isEmpty()) {
                createMergeRequestAndMergeItIfPossible(client, repository, headBranch, baseBranch)
            } else {
                verifyMergeability(mergeRequests.first())
                client.mergeRequestApi.acceptMergeRequest(repository, mergeRequests.first().iid)
            }

            log.info("Branch: $headBranch successfully merged into branch: $baseBranch")
        } catch (e: Exception) {
            log.error("Failed to merge branch: $headBranch into branch: $baseBranch with error: ${e.message}")
            handleResponseError(error = e, repository = repository, baseBranch = baseBranch, headBranch = headBranch)
        }
    }

    private fun createMergeRequestAndMergeItIfPossible(
        client: GitLabApi,
        repository: String,
        headBranch: String,
        baseBranch: String
    ) {
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
    }

    override fun createBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String,
        baseBranchName: String
    ): Optional<String> {
        log.info("Attempting to create new branch on GitLab repository: $repository from base: $baseBranchName and with name: $branchName")

        return try {
            Optional.of(
                getClient(gitCredentials).repositoryApi.createBranch(repository, branchName, baseBranchName)
                    .name
            ).also { log.info("New branch: $branchName created successfully") }
        } catch (exception: Exception) {
            log.error("failed to create branch: $branchName with error: ${exception.message}")
            handleResponseError(
                error = exception,
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
        log.info("Attempting to create new release on GitLab repository: $repository from base: $sourceBranch and with name: $releaseName")

        return try {
            val client = getClient(gitCredentials)
            val tag = client.tagsApi.createTag(repository, releaseName, sourceBranch, RELEASE_DESCRIPTION, description)
            Optional.of(client.tagsApi.createRelease(repository, tag.name, RELEASE_DESCRIPTION).tagName).apply {
                log.info("Release: $releaseName created successfully")
            }
        } catch (exception: Exception) {
            log.error("failed to create release: $releaseName with error: ${exception.message}")
            handleResponseError(
                error = exception,
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
            log.info("Comparing head: $headBranch with base: $baseBranch on GitLab repository: $repository")
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
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND)
                .withParameters(branchName)

            isNotFoundError(error) && containsErrorMessage(
                error,
                "404 Tag Not Found"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_TAG_NOT_FOUND)
                .withParameters(releaseName)

            isNotFoundError(error) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND)
                .withParameters(repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Branch already exists"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH)
                .withParameters(branchName, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Invalid reference name"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND)
                .withParameters(baseBranch, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Target $baseBranch is invalid"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND)
                .withParameters(releaseName, repository)

            isClientError(error) && containsErrorMessage(
                error,
                "Tag $releaseName already exists"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_DUPLICATED_TAG)
                .withParameters(releaseName, repository)

            isConflictError(error) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_MERGE_CONFLICT)
                .withParameters(headBranch, baseBranch, repository)

            isMethodNotAllowedError(error) && containsErrorMessage(error, "Method Not Allowed") ->
                throw BusinessException.of(MooveErrorCode.GIT_ERROR_MERGE_ERROR)
                    .withParameters(repository)

            isForbiddenError(error) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_FORBIDDEN)
                .withParameters(repository)

            error is GitLabApiException -> throw BusinessException.of(
                MooveErrorCode.GIT_INTEGRATION_ERROR,
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
