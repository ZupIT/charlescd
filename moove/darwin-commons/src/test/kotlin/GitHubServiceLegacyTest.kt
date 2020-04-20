/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.client.GitClient
import br.com.zup.darwin.commons.integration.git.service.GitHubServiceLegacyLegacy
import br.com.zup.darwin.entity.GitServiceProvider
import br.com.zup.darwin.entity.GitCredentials
import br.com.zup.exception.handler.exception.BusinessException
import com.google.gson.JsonObject
import br.com.zup.darwin.commons.integration.git.factory.GitHubClientFactoryLegacy
import io.mockk.every
import io.mockk.mockkClass
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.RepositoryCommitCompare
import org.eclipse.egit.github.core.RequestError
import org.eclipse.egit.github.core.TypedResource
import org.eclipse.egit.github.core.client.GitHubResponse
import org.eclipse.egit.github.core.client.RequestException
import org.junit.Assert
import org.junit.Test
import java.net.HttpURLConnection
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class GitHubServiceLegacyTest {

    private val gitHubClientFactory = mockkClass(GitHubClientFactoryLegacy::class)
    private val gitClient = mockkClass(GitClient::class)
    private val gitHubService = GitHubServiceLegacyLegacy(gitHubClientFactory)
    private val gitCredentials = GitCredentials("", "user", "pass", "", GitServiceProvider.GITHUB)
    private val repository = "zup/darwin"
    private val connection = mockkClass(HttpURLConnection::class)

    @Test
    fun `should create a new branch`() {
        val newBranchName = "newBranch"
        val branchesResourceResponse = createReference("master")
        val createBranchResourceResponse = createReference(newBranchName)

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection,  branchesResourceResponse)
        every { gitClient.post<Reference>(any(), any(), Reference::class.java) } returns createBranchResourceResponse

        val createdBranch = gitHubService.createBranch(gitCredentials, repository, newBranchName)

        Assert.assertEquals(newBranchName, createdBranch.get())
    }

    @Test
    fun `should not create a new branch if base does not exist`() {
        val newBranchName = "newBranch"
        val notFoundError = object : RequestError() {
            override fun getMessage() = "Not Found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } throws RequestException(notFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.createBranch(gitCredentials, repository, newBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create duplicated branches`() {
        val newBranchName = "newBranch"
        val createBranchResourceResponse = createReference(newBranchName)
        val duplicatedBranchError = object : RequestError() {
            override fun getMessage() = "Reference already exists"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection,  createBranchResourceResponse)
        every { gitClient.post<Reference>(any(), any(), Reference::class.java) } throws RequestException(duplicatedBranchError, 422)

        val e = assertFailsWith<BusinessException> {
            gitHubService.createBranch(gitCredentials, repository, newBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH.toString(), e.errorCode.toString())
    }

    @Test
    fun `should merge branches`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } returns JsonObject()

        gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
    }

    @Test
    fun `should not merge branches on conflict`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val conflictError = object : RequestError() {
            override fun getMessage() = "Merge conflict"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(conflictError, 409)

        val e = assertFailsWith<BusinessException> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_MERGE_CONFLICT.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not merge branches if base branch does not exist`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val baseNotFoundError = object : RequestError() {
            override fun getMessage() = "Base does not exist"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(baseNotFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not merge branches if head branch does not exist`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val headNotFoundError = object : RequestError() {
            override fun getMessage() = "Head does not exist"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(headNotFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_HEAD_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not merge branches if repository does not exist`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val repositoryNotFoundError = object : RequestError() {
            override fun getMessage() = "Not found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(repositoryNotFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should create a new release`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val createReleaseResponse = JsonObject().apply {
            addProperty("name", "RC-1.0.0")
            addProperty("tag_name", "RC-1.0.0")
            addProperty("body", "darwin create release candidate operation")
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } returns createReleaseResponse

        val createdRelease = gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch)

        Assert.assertEquals(releaseName, createdRelease.get())
    }

    @Test
    fun `should not create a new release if tag already exists`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"

        val duplicatedTagError = object : RequestError() {
            override fun getMessage() = "(Tag Already Exists)"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(duplicatedTagError, 422)

        val e = assertFailsWith<BusinessException> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch) }

        assertEquals(MooveErrorCode.GIT_ERROR_DUPLICATED_TAG.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create a new release if repository does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"

        val notFoundError = object : RequestError() {
            override fun getMessage() = "Not found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(notFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch) }

        assertEquals(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create a new release if source does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"

        val notFoundError = object : RequestError() {
            override fun getMessage() = "Invalid value for 'target_commitish' field"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.post<JsonObject>(any(), any(), any()) } throws RequestException(notFoundError, 422)

        val e = assertFailsWith<BusinessException> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch) }

        assertEquals(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should find a release by tag name`() {
        val releaseName = "RC-1.0.0"

        val findReleaseResponse = JsonObject().apply {
            addProperty("name", "RC-1.0.0")
            addProperty("tag_name", "RC-1.0.0")
            addProperty("body", "darwin create release candidate operation")
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection,  findReleaseResponse)

        val release = gitHubService.findRelease(gitCredentials, repository, releaseName)

        assertEquals(releaseName, release.get())
    }

    @Test
    fun `should not find a release if tag name does not exist`() {
        val releaseName = "RC-1.0.0"

        val notFoundError = object : RequestError() {
            override fun getMessage() = "Not found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } throws RequestException(notFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.findRelease(gitCredentials, repository, releaseName) }

        assertEquals(MooveErrorCode.GIT_ERROR_TAG_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should find a branch by name`() {
        val branchName = "branch"
        val branchResourceResponse = createReference(branchName)

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection,  branchResourceResponse)

        val branch = gitHubService.findBranch(gitCredentials, repository, branchName)

        assertEquals(branchName, branch.get())
    }

    @Test
    fun `should not find a branch by name if it does not exist`() {
        val branchName = "newBranch"
        val notFoundError = object : RequestError() {
            override fun getMessage() = "Not found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } throws RequestException(notFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.findBranch(gitCredentials, repository, branchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should delete a branch by name`() {
        val branchName = "branch"

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.delete(any()) } answers {}

        gitHubService.deleteBranch(gitCredentials, repository, branchName)
    }

    @Test
    fun `should not delete a branch by name if it does not exist`() {
        val branchName = "branch"
        val referenceNotFoundError = object : RequestError() {
            override fun getMessage() = "Reference does not exist"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.delete(any()) } throws RequestException(referenceNotFoundError, 422)

        val e = assertFailsWith<BusinessException> {
            gitHubService.deleteBranch(gitCredentials, repository, branchName) }
        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should compare branches`() {
        val baseBranch = "base"
        val headBranch = "head"
        val result = RepositoryCommitCompare().apply {
            aheadBy = 1
            behindBy = 2
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection, result)

        val compareResult = gitHubService.compareBranches(gitCredentials, repository, baseBranch, headBranch)

        assertEquals(repository, compareResult.repository)
        assertEquals(baseBranch, compareResult.baseBranch)
        assertEquals(headBranch, compareResult.headBranch)
        assertEquals(1, compareResult.aheadBy)
        assertEquals(2, compareResult.behindBy)
    }

    @Test
    fun `should not compare branches if head branch does not exist`() {
        val baseBranch = "base"
        val headBranch = "head"
        val notFoundError = object : RequestError() {
            override fun getMessage() = "Not found"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } throws RequestException(notFoundError, 404)

        val e = assertFailsWith<BusinessException> {
            gitHubService.compareBranches(gitCredentials, repository, baseBranch, headBranch) }
        assertEquals(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should return service type`() {
        assertEquals(GitServiceProvider.GITHUB, gitHubService.getProviderType())
    }

    private fun createReference(branchName: String): Reference =
        Reference()
            .apply { ref = "refs/heads/$branchName" }
            .apply { url = "https://api.github.com/repos/zup/darwin/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc" }
            .apply {
                `object` = TypedResource()
                    .apply { type = TypedResource.TYPE_COMMIT }
            }
}