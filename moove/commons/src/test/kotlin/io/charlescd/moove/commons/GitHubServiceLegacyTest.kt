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

package io.charlescd.moove.commons

import com.google.gson.JsonObject
import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.integration.git.client.GitClient
import io.charlescd.moove.commons.integration.git.factory.GitHubClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.service.GitHubServiceLegacy
import io.charlescd.moove.legacy.repository.entity.GitCredentials
import io.charlescd.moove.legacy.repository.entity.GitServiceProvider
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
    private val gitHubService = GitHubServiceLegacy(gitHubClientFactory)
    private val gitCredentials = GitCredentials("", "user", "pass", "", GitServiceProvider.GITHUB)
    private val repository = "zup/charles"
    private val connection = mockkClass(HttpURLConnection::class)

    @Test
    fun `should create a new branch`() {
        val newBranchName = "newBranch"
        val branchesResourceResponse = createReference("master")
        val createBranchResourceResponse = createReference(newBranchName)

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection, branchesResourceResponse)
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.createBranch(gitCredentials, repository, newBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should not create duplicated branches`() {
        val newBranchName = "newBranch"
        val createBranchResourceResponse = createReference(newBranchName)
        val duplicatedBranchError = object : RequestError() {
            override fun getMessage() = "Reference already exists"
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection, createBranchResourceResponse)
        every { gitClient.post<Reference>(any(), any(), Reference::class.java) } throws RequestException(
            duplicatedBranchError,
            422
        )

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.createBranch(gitCredentials, repository, newBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_BRANCH, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_MERGE_CONFLICT, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_HEAD_NOT_FOUND, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should create a new release`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val createReleaseResponse = JsonObject().apply {
            addProperty("name", "RC-1.0.0")
            addProperty("tag_name", "RC-1.0.0")
            addProperty("body", "charles create release candidate operation")
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_TAG, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should find a release by tag name`() {
        val releaseName = "RC-1.0.0"

        val findReleaseResponse = JsonObject().apply {
            addProperty("name", "RC-1.0.0")
            addProperty("tag_name", "RC-1.0.0")
            addProperty("body", "Charles create release candidate operation")
        }

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection, findReleaseResponse)

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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.findRelease(gitCredentials, repository, releaseName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_TAG_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should find a branch by name`() {
        val branchName = "branch"
        val branchResourceResponse = createReference(branchName)

        every { gitHubClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.get(any()) } returns GitHubResponse(connection, branchResourceResponse)

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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.findBranch(gitCredentials, repository, branchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.deleteBranch(gitCredentials, repository, branchName)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
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

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitHubService.compareBranches(gitCredentials, repository, baseBranch, headBranch)
        }
        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should return service type`() {
        assertEquals(GitServiceProvider.GITHUB, gitHubService.getProviderType())
    }

    private fun createReference(branchName: String): Reference =
        Reference()
            .apply { ref = "refs/heads/$branchName" }
            .apply { url = "https://api.github.com/repos/zup/charles/commits/c5b97d5ae6c19d5c5df71a34c7fbeeda2479ccbc" }
            .apply {
                `object` = TypedResource()
                    .apply { type = TypedResource.TYPE_COMMIT }
            }
}
