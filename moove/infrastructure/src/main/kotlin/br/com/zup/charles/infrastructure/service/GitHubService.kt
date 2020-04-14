/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.CompareResult
import br.com.zup.charles.domain.GitCredentials
import br.com.zup.charles.domain.GitServiceProvider
import br.com.zup.charles.domain.service.GitService
import br.com.zup.charles.infrastructure.CharlesErrorCode
import br.com.zup.exception.handler.exception.BusinessException
import com.google.gson.JsonObject
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.RepositoryId
import org.eclipse.egit.github.core.client.GitHubClient
import org.eclipse.egit.github.core.client.GitHubRequest
import org.eclipse.egit.github.core.client.RequestException
import org.eclipse.egit.github.core.service.CommitService
import org.eclipse.egit.github.core.service.DataService
import org.eclipse.egit.github.core.service.RepositoryService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*

@Component
class GitHubService(private val gitHubClientFactory: GitHubClientFactory) : GitService() {

    companion object {
        const val BRANCH_PREFIX = "refs/heads/"
    }

    private val logger = LoggerFactory.getLogger(this.javaClass)

    override fun mergeBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ) {
        logger.info("attempting to merge branch: $headBranch into $baseBranch on GitHub repository: $repository")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        try {
            mergeBranches(repositoryService, repository, baseBranch, headBranch, COMMIT_MESSAGE)
            logger.info("branch: $headBranch successfully merged into branch: $baseBranch")
        } catch (e: Exception) {
            logger.error("failed to merge branch: $headBranch into branch: $baseBranch with error: ${e.message}")
            handleResponseError(error = e, repository = repository, baseBranch = baseBranch, headBranch = headBranch)
        }
    }

    override fun createBranch(
        gitCredentials: GitCredentials,
        repository: String,
        branchName: String,
        baseBranchName: String
    ): Optional<String> {
        logger.info("attempting to create new branch on GitHub repository: $repository from base: $baseBranchName and with name: $branchName")
        val repositoryId = RepositoryId.createFromId(repository)
        val service = DataService(getClient(gitCredentials))
        return try {
            val baseBranch = findBranchByName(service, repositoryId, baseBranchName)
            val result = createReferenceName(baseBranch, branchName, service, repositoryId)
            logger.info("new branch: $branchName created successfully")
            Optional.of(result)
        } catch (exception: Exception) {
            logger.error("failed to create branch: $branchName with error: ${exception.message}")
            handleResponseError(
                error = exception,
                repository = repository,
                baseBranch = baseBranchName,
                branchName = branchName
            )
            Optional.empty()
        }
    }

    private fun createReferenceName(
        baseBranch: Reference,
        branchName: String,
        service: DataService,
        repositoryId: RepositoryId?
    ): String {
        val reference = Reference()
        reference.setObject(baseBranch.`object`)
        reference.setRef("$BRANCH_PREFIX$branchName")

        return service.createReference(repositoryId, reference).ref.substringAfter(BRANCH_PREFIX)
    }

    override fun createRelease(
        gitCredentials: GitCredentials,
        repository: String,
        releaseName: String,
        sourceBranch: String,
        description: String
    ): Optional<String> {
        logger.info("attempting to create new release on GitHub repository: $repository from base: $sourceBranch and with name: $releaseName")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        return try {

            val result = createRelease(
                repositoryService,
                repository,
                sourceBranch,
                releaseName,
                description
            )

            logger.info("release: $releaseName created successfully")

            Optional.of(result.get("name").asString)
        } catch (exception: Exception) {
            logger.error("failed to create release: $releaseName with error: ${exception.message}")
            handleResponseError(
                error = exception,
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
        logger.info("searching for release: $releaseName into GitHub repository: $repository")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        return try {
            Optional.of(findReleaseByTagName(repositoryService, repository, releaseName).get("name").asString).also {
                logger.info("found release: $releaseName into GitHub repository: $repository")
            }
        } catch (e: Exception) {
            logger.error("failed to find release: $releaseName with error: ${e.message}")
            handleReleaseNotFound(e, releaseName)
            handleResponseError(error = e, repository = repository, releaseName = releaseName)
            Optional.empty()
        }
    }

    override fun findBranch(gitCredentials: GitCredentials, repository: String, branchName: String): Optional<String> {
        logger.info("searching for branch: $branchName into GitHub repository: $repository")
        val client = getClient(gitCredentials)
        val dataService = DataService(client)
        return try {
            Optional.of(
                findBranchByName(
                    dataService,
                    RepositoryId.createFromId(repository),
                    branchName
                ).ref.substringAfter(BRANCH_PREFIX)
            )
        } catch (exception: Exception) {
            logger.error("failed to find branch: $branchName with error: ${exception.message}")
            handleResponseError(error = exception, repository = repository, branchName = branchName)
            Optional.empty()
        }
    }

    override fun deleteBranch(gitCredentials: GitCredentials, repository: String, branchName: String) {
        logger.info("deleting branch: $branchName from GitHub repository: $repository")
        val repositoryService = RepositoryService(getClient(gitCredentials))
        try {
            deleteBranch(repositoryService, repository, branchName)
            logger.info("branch: $branchName successfully deleted from GitHub repository: $repository")
        } catch (exception: Exception) {
            logger.error("error trying to delete branch: $branchName from GitHub repository: $repository")
            handleResponseError(exception, branchName, repository)
        }
    }

    override fun compareBranches(
        gitCredentials: GitCredentials,
        repository: String,
        baseBranch: String,
        headBranch: String
    ): CompareResult {
        return try {
            logger.info("comparing head: $headBranch with base: $baseBranch on GitHub repository: $repository")
            CommitService(getClient(gitCredentials)).compare(
                RepositoryId.createFromId(repository),
                "$BRANCH_PREFIX$baseBranch",
                "$BRANCH_PREFIX$headBranch"
            ).let { CompareResult(repository, baseBranch, headBranch, it.aheadBy, it.behindBy) }
        } catch (exception: Exception) {
            logger.error("error comparing head: $headBranch with base: $baseBranch on GitHub repository: $repository")
            handleResponseError(
                error = exception,
                repository = repository,
                baseBranch = baseBranch,
                headBranch = headBranch
            )
            CompareResult(repository, baseBranch, headBranch, 0, 0)
        }
    }

    override fun getProviderType(): GitServiceProvider = GitServiceProvider.GITHUB

    private fun findBranchByName(service: DataService, repositoryId: RepositoryId, branchName: String): Reference {
        return try {
            service.getReference(repositoryId, "$BRANCH_PREFIX$branchName")
        } catch (exception: RequestException) {
            throw if (exception.status == 404) {
                BusinessException.of(CharlesErrorCode.GIT_ERROR_BRANCH_NOT_FOUND, branchName, repositoryId.toString())
            } else {
                exception
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
            isNotFoundError(error) && containsErrorMessage(error, "Base does not exist") -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_BASE_NOT_FOUND,
                baseBranch,
                repository
            )

            isNotFoundError(error) && containsErrorMessage(error, "Head does not exist") -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_HEAD_NOT_FOUND,
                headBranch,
                repository
            )

            isNotFoundError(error) -> repositoryNotFound(repository)

            isConflictError(error) && containsErrorMessage(error, "Merge conflict") -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_MERGE_CONFLICT,
                headBranch,
                baseBranch,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "(Tag Already Exists)"
            ) -> throw BusinessException.of(CharlesErrorCode.GIT_ERROR_DUPLICATED_TAG, releaseName, repository)

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Reference already exists"
            ) -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_DUPLICATED_BRANCH,
                branchName,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Reference does not exist"
            ) -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_BRANCH_NOT_FOUND,
                branchName,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Invalid value for 'target_commitish' field"
            ) -> throw BusinessException.of(
                CharlesErrorCode.GIT_ERROR_BASE_NOT_FOUND,
                branchName,
                repository
            )

            error is RequestException -> throw BusinessException.of(
                CharlesErrorCode.GIT_INTEGRATION_ERROR,
                error.message
            )

            error is BusinessException -> throw error

            else -> throw RuntimeException(error)
        }
    }

    private fun isNotFoundError(error: Exception): Boolean = error is RequestException && error.status == 404

    private fun isConflictError(error: Exception): Boolean = error is RequestException && error.status == 409

    private fun isUnprocessableError(error: Exception): Boolean = error is RequestException && error.status == 422

    private fun handleReleaseNotFound(error: Exception, releaseName: String) {
        if (isNotFoundError(error)) {
            throw BusinessException.of(CharlesErrorCode.GIT_ERROR_TAG_NOT_FOUND, releaseName)
        }
    }

    private fun repositoryNotFound(repository: String) {
        throw BusinessException.of(CharlesErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND, repository)
    }

    private fun getClient(gitConfiguration: GitCredentials): GitHubClient =
        gitHubClientFactory.buildGitClient(gitConfiguration)

    private fun mergeBranches(
        repositoryService: RepositoryService,
        repository: String,
        baseBranch: String,
        headBranch: String,
        commitMessage: String
    ) {
        repositoryService.client.post<JsonObject>(
            "/repos/${RepositoryId.createFromId(repository)}/merges",
            mapOf(
                "base" to baseBranch,
                "head" to headBranch,
                "commit_message" to commitMessage
            )
            , JsonObject::class.java
        )
    }

    private fun createRelease(
        repositoryService: RepositoryService,
        repository: String,
        sourceBranch: String,
        releaseName: String,
        releaseDescription: String,
        draft: Boolean = false,
        preRelease: Boolean = false
    ): JsonObject =
        repositoryService.client.post(
            "/repos/${RepositoryId.createFromId(repository)}/releases",
            mapOf(
                "tag_name" to releaseName,
                "name" to releaseName,
                "target_commitish" to sourceBranch,
                "body" to releaseDescription,
                "draft" to draft,
                "prerelease" to preRelease

            ), JsonObject::class.java
        )

    private fun findReleaseByTagName(
        repositoryService: RepositoryService,
        repository: String,
        releaseName: String
    ): JsonObject =
        repositoryService.client.get(GitHubRequest().apply {
                uri = "/repos/${RepositoryId.createFromId(repository)}/releases/tags/$releaseName"
            }
            .apply { type = JsonObject::class.java }).body as JsonObject


    private fun deleteBranch(
        repositoryService: RepositoryService,
        repository: String,
        branchName: String
    ) {
        repositoryService.client.delete("/repos/${RepositoryId.createFromId(repository)}/git/refs/heads/$branchName")
    }
}