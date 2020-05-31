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

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.BusinessExceptionLegacy
import io.charlescd.moove.commons.integration.git.factory.GitLabClientFactoryLegacy
import io.charlescd.moove.commons.integration.git.service.GitLabServiceLegacy
import io.charlescd.moove.legacy.repository.entity.GitCredentials
import io.charlescd.moove.legacy.repository.entity.GitServiceProvider
import io.mockk.every
import io.mockk.mockkClass
import org.gitlab4j.api.GitLabApi
import org.gitlab4j.api.GitLabApiException
import org.gitlab4j.api.models.*
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class GitLabServiceLegacyTest {

    private val gitLabClientFactory = mockkClass(GitLabClientFactoryLegacy::class)
    private val gitClient = mockkClass(GitLabApi::class)
    private val gitLabService = GitLabServiceLegacy(gitLabClientFactory)
    private val gitCredentials = GitCredentials(
        "address", "", "", "token",
        GitServiceProvider.GITLAB
    )
    private val repository = "zup/charles"

    @Test
    fun `should create a new branch`() {
        val newBranchName = "newBranch"
        val baseBranchName = "baseBranch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.createBranch(repository, newBranchName, baseBranchName) } returns
                Branch().apply { name = newBranchName }

        val newBranch = gitLabService.createBranch(gitCredentials, repository, newBranchName, baseBranchName)

        assertEquals(newBranchName, newBranch.get())
    }

    @Test
    fun `should not create a new branch if base does not exist`() {
        val newBranchName = "newBranch"
        val baseBranchName = "baseBranch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.createBranch(repository, newBranchName, baseBranchName) } throws
                GitLabApiException("Invalid reference name", 400)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.createBranch(gitCredentials, repository, newBranchName, baseBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should not create duplicated branches`() {
        val newBranchName = "newBranch"
        val baseBranchName = "baseBranch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.createBranch(repository, newBranchName, baseBranchName) } throws
                GitLabApiException("Branch already exists", 400)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.createBranch(gitCredentials, repository, newBranchName, baseBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_BRANCH, e.getErrorCode())
    }

    @Test
    fun `should merge branches creating a new merge request`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val mergeRequest = MergeRequest().apply {
            mergeStatus = "can_be_merged"
            iid = 1
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } returns emptyList()
        every {
            gitClient.mergeRequestApi.createMergeRequest(
                repository,
                headBranchName,
                baseBranchName,
                any(),
                any(),
                null
            )
        } returns mergeRequest
        every { gitClient.mergeRequestApi.acceptMergeRequest(repository, mergeRequest.iid) } returns mergeRequest

        gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
    }

    @Test
    fun `should merge branches with an existent merge request`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val mergeRequest = MergeRequest().apply {
            mergeStatus = "can_be_merged"
            iid = 1
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } returns listOf(mergeRequest)
        every { gitClient.mergeRequestApi.acceptMergeRequest(repository, mergeRequest.iid) } returns mergeRequest

        gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
    }

    @Test
    fun `should not merge branches on conflict with an existent merge request`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val mergeRequest = MergeRequest().apply {
            mergeStatus = "cannot_be_merged"
            iid = 1
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } returns listOf(mergeRequest)
        every { gitClient.mergeRequestApi.acceptMergeRequest(repository, mergeRequest.iid) } returns mergeRequest

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_MERGE_CONFLICT, e.getErrorCode())
    }


    @Test
    fun `should not merge branches on conflict with a new merge request`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        val mergeRequest = MergeRequest().apply {
            mergeStatus = "cannot_be_merged"
            iid = 1
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } returns listOf()
        every {
            gitClient.mergeRequestApi.createMergeRequest(
                repository,
                headBranchName,
                baseBranchName,
                any(),
                any(),
                null
            )
        } returns mergeRequest
        every { gitClient.mergeRequestApi.acceptMergeRequest(repository, mergeRequest.iid) } returns mergeRequest

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_MERGE_CONFLICT, e.getErrorCode())
    }

    @Test
    fun `should not merge branches if repository does not exist`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } throws GitLabApiException("", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should not merge branches if accepting a merge request fails`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } throws GitLabApiException(
            "‘Method Not Allowed",
            405
        )

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_MERGE_ERROR, e.getErrorCode())
    }

    @Test
    fun `should create a new release`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "Charles create release candidate operation"
        val tag = Tag().apply {
            name = releaseName
            message = releaseCreationMessage
        }
        val release = Release().apply {
            tagName = tag.name
            description = tag.message
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every {
            gitClient.tagsApi.createTag(
                repository,
                releaseName,
                sourceBranch,
                releaseCreationMessage,
                ""
            )
        } returns tag
        every { gitClient.tagsApi.createRelease(repository, tag.name, releaseCreationMessage) } returns release

        val createdRelease = gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)

        assertEquals(releaseName, createdRelease.get())
    }

    @Test
    fun `should not create a new release if tag already exists`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "Charles create release candidate operation"


        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every {
            gitClient.tagsApi.createTag(
                repository,
                releaseName,
                sourceBranch,
                releaseCreationMessage,
                ""
            )
        } throws GitLabApiException("Tag $releaseName already exists", 400)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_DUPLICATED_TAG, e.getErrorCode())
    }

    @Test
    fun `should not create a new release if repository does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "Charles create release candidate operation"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every {
            gitClient.tagsApi.createTag(
                repository,
                releaseName,
                sourceBranch,
                releaseCreationMessage,
                ""
            )
        } throws GitLabApiException("", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_REPOSITORY_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should not create a new release if source does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "Charles create release candidate operation"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every {
            gitClient.tagsApi.createTag(
                repository,
                releaseName,
                sourceBranch,
                releaseCreationMessage,
                ""
            )
        } throws GitLabApiException("Target $sourceBranch is invalid", 400)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BASE_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should find a release by tag name`() {
        val releaseName = "RC-1.0.0"
        val tag = Tag().apply {
            name = releaseName
            release = Release().apply {
                tagName = releaseName
            }
        }

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.tagsApi.getTag(repository, releaseName) } returns tag

        val release = gitLabService.findRelease(gitCredentials, repository, releaseName)

        assertEquals(releaseName, release.get())
    }

    @Test
    fun `should not find a release if tag name does not exist`() {
        val releaseName = "RC-1.0.0"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.tagsApi.getTag(repository, releaseName) } throws GitLabApiException("404 Tag Not Found", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.findRelease(gitCredentials, repository, releaseName)
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_TAG_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should find a branch by name`() {
        val branchName = "branch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.getBranch(repository, branchName) } returns Branch().apply { name = branchName }

        val branch = gitLabService.findBranch(gitCredentials, repository, branchName)

        assertEquals(branchName, branch.get())
    }

    @Test
    fun `should not find a branch by name if it does not exist`() {
        val branchName = "branch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every {
            gitClient.repositoryApi.getBranch(
                repository,
                branchName
            )
        } throws GitLabApiException("404 Branch Not Found", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.findBranch(
                gitCredentials,
                repository,
                branchName
            )
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should delete a branch by name`() {
        val branchName = "branch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.deleteBranch(repository, branchName) } answers {}

        gitLabService.deleteBranch(gitCredentials, repository, branchName)
    }

    @Test
    fun `should not delete a branch by name if it does not exist`() {
        val branchName = "branch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.deleteBranch(repository, branchName) } throws
                GitLabApiException("404 Branch Not Found", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.deleteBranch(
                gitCredentials,
                repository,
                branchName
            )
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should compare branches`() {
        val baseBranch = "base"
        val headBranch = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.compare(repository, baseBranch, headBranch) } returns CompareResults().apply {
            commit = Commit()
            commits = listOf(Commit(), Commit())
        }

        val compareResult = gitLabService.compareBranches(gitCredentials, repository, baseBranch, headBranch)

        assertEquals(baseBranch, compareResult.baseBranch)
        assertEquals(headBranch, compareResult.headBranch)
        assertEquals(repository, compareResult.repository)
        assertEquals(0, compareResult.aheadBy)
        assertEquals(2, compareResult.behindBy)
    }

    @Test
    fun `should compare if base does not exist`() {
        val baseBranch = "base"
        val headBranch = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitLabService.compareBranches(gitCredentials, repository, baseBranch, headBranch) } throws
                GitLabApiException("404 Branch Not Found", 404)

        val e = assertFailsWith<BusinessExceptionLegacy> {
            gitLabService.compareBranches(
                gitCredentials,
                repository,
                baseBranch,
                headBranch
            )
        }

        assertEquals(MooveErrorCodeLegacy.GIT_ERROR_BRANCH_NOT_FOUND, e.getErrorCode())
    }

    @Test
    fun `should return service type`() {
        assertEquals(GitServiceProvider.GITLAB, gitLabService.getProviderType())
    }
}
