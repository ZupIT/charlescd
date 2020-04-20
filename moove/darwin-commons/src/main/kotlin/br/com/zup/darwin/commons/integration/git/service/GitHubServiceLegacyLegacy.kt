/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.integration.git.service

import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.extension.createRelease
import br.com.zup.darwin.commons.integration.git.extension.deleteBranch
import br.com.zup.darwin.commons.integration.git.extension.findReleaseByTagName
import br.com.zup.darwin.commons.integration.git.extension.mergeBranches
import br.com.zup.darwin.commons.integration.git.factory.GitHubClientFactoryLegacy
import br.com.zup.darwin.commons.integration.git.model.CompareResult
import br.com.zup.darwin.entity.GitCredentials
import br.com.zup.darwin.entity.GitServiceProvider
import br.com.zup.exception.handler.exception.BusinessException
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.RepositoryId
import org.eclipse.egit.github.core.client.GitHubClient
import org.eclipse.egit.github.core.client.RequestException
import org.eclipse.egit.github.core.service.CommitService
import org.eclipse.egit.github.core.service.DataService
import org.eclipse.egit.github.core.service.RepositoryService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.Optional

@Component
class GitHubServiceLegacyLegacy(private val gitHubClientFactoryLegacy: GitHubClientFactoryLegacy) : GitServiceLegacy() {

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
            RepositoryService(getClient(gitCredentials)).mergeBranches(repository, baseBranch, headBranch,
                COMMIT_MESSAGE)
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
            handleResponseError(error = e, repository = repository, baseBranch = baseBranchName, branchName = branchName)
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
            Optional.of(repositoryService.createRelease(repository, sourceBranch, releaseName, description).get("name")
                .asString).apply {
                log.info("release: $releaseName created successfully")
            }
        } catch (e: Exception) {
            log.error("failed to create release: $releaseName with error: ${e.message}")
            handleResponseError(error = e, repository = repository, baseBranch = sourceBranch, releaseName = releaseName)
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
            Optional.of(findBranchByName(dataService, RepositoryId.createFromId(repository), branchName).ref.substringAfter(branchPrefix))
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
                BusinessException.of(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND, branchName, repositoryId.toString())
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
            isNotFoundError(error) && containsErrorMessage(error, "Base does not exist") -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND,
                baseBranch,
                repository
            )

            isNotFoundError(error) && containsErrorMessage(error, "Head does not exist") -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_HEAD_NOT_FOUND,
                headBranch,
                repository
            )

            isNotFoundError(error) -> repositoryNotFound(repository)

            isConflictError(error) && containsErrorMessage(error, "Merge conflict") -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_MERGE_CONFLICT,
                headBranch,
                baseBranch,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "(Tag Already Exists)"
            ) -> throw BusinessException.of(MooveErrorCode.GIT_ERROR_DUPLICATED_TAG, releaseName, repository)

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Reference already exists"
            ) -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH,
                branchName,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Reference does not exist"
            ) -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND,
                branchName,
                repository
            )

            isUnprocessableError(error) && containsErrorMessage(
                error,
                "Invalid value for 'target_commitish' field"
            ) -> throw BusinessException.of(
                MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND,
                branchName,
                repository
            )

            error is RequestException -> throw BusinessException.of(MooveErrorCode.GIT_INTEGRATION_ERROR, error.message)

            error is BusinessException -> throw error

            else -> throw RuntimeException(error)
        }
    }

    private fun isNotFoundError(error: Exception): Boolean = error is RequestException && error.status == 404
    
    private fun isConflictError(error: Exception): Boolean = error is RequestException && error.status == 409

    private fun isUnprocessableError(error: Exception): Boolean = error is RequestException && error.status == 422

    private fun handleReleaseNotFound(e: Exception, releaseName: String) {
        if(isNotFoundError(e)) {
            throw BusinessException.of(MooveErrorCode.GIT_ERROR_TAG_NOT_FOUND, releaseName)
        }
    }

    private fun repositoryNotFound(repository: String) {
        throw BusinessException.of(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND, repository)
    }

    private fun getClient(gitConfiguration: GitCredentials): GitHubClient =
        gitHubClientFactoryLegacy.buildGitClient(gitConfiguration)
}