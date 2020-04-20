/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.darwin.commons.integration.git.service.GitLabServiceLegacyLegacy
import br.com.zup.darwin.entity.GitServiceProvider
import br.com.zup.darwin.entity.GitCredentials
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.darwin.commons.integration.git.factory.GitLabClientFactoryLegacy
import io.mockk.every
import io.mockk.mockkClass
import org.gitlab4j.api.GitLabApi
import org.gitlab4j.api.GitLabApiException
import org.gitlab4j.api.models.Branch
import org.gitlab4j.api.models.Commit
import org.gitlab4j.api.models.CompareResults
import org.gitlab4j.api.models.MergeRequest
import org.gitlab4j.api.models.Release
import org.gitlab4j.api.models.Tag
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class GitLabServiceLegacyTest {

    private val gitLabClientFactory = mockkClass(GitLabClientFactoryLegacy::class)
    private val gitClient = mockkClass(GitLabApi::class)
    private val gitLabService = GitLabServiceLegacyLegacy(gitLabClientFactory)
    private val gitCredentials = GitCredentials(
        "address", "", "", "token",
        GitServiceProvider.GITLAB
    )
    private val repository = "zup/darwin"

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

        val e = assertFailsWith<BusinessException> {
            gitLabService.createBranch(gitCredentials, repository, newBranchName, baseBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create duplicated branches`() {
        val newBranchName = "newBranch"
        val baseBranchName = "baseBranch"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.createBranch(repository, newBranchName, baseBranchName) } throws
                GitLabApiException("Branch already exists", 400)

        val e = assertFailsWith<BusinessException> {
            gitLabService.createBranch(gitCredentials, repository, newBranchName, baseBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH.toString(), e.errorCode.toString())
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

        val e = assertFailsWith<BusinessException> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_MERGE_CONFLICT.toString(), e.errorCode.toString())
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

        val e = assertFailsWith<BusinessException> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_MERGE_CONFLICT.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not merge branches if repository does not exist`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } throws GitLabApiException("", 404)

        val e = assertFailsWith<BusinessException> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not merge branches if accepting a merge request fails`() {
        val baseBranchName = "base"
        val headBranchName = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.mergeRequestApi.getMergeRequests(any()) } throws GitLabApiException("‘Method Not Allowed", 405)

        val e = assertFailsWith<BusinessException> {
            gitLabService.mergeBranches(gitCredentials, repository, baseBranchName, headBranchName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_MERGE_ERROR.toString(), e.errorCode.toString())
    }

    @Test
    fun `should create a new release`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "darwin create release candidate operation"
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
        val releaseCreationMessage = "darwin create release candidate operation"


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

        val e = assertFailsWith<BusinessException> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_DUPLICATED_TAG.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create a new release if repository does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "darwin create release candidate operation"

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

        val e = assertFailsWith<BusinessException> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should not create a new release if source does not exist`() {
        val sourceBranch = "master"
        val releaseName = "RC-1.0.0"
        val releaseCreationMessage = "darwin create release candidate operation"

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

        val e = assertFailsWith<BusinessException> {
            gitLabService.createRelease(gitCredentials, repository, releaseName, sourceBranch)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND.toString(), e.errorCode.toString())
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

        val e = assertFailsWith<BusinessException> {
            gitLabService.findRelease(gitCredentials, repository, releaseName)
        }

        assertEquals(MooveErrorCode.GIT_ERROR_TAG_NOT_FOUND.toString(), e.errorCode.toString())
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
        every { gitClient.repositoryApi.getBranch(repository, branchName) } throws GitLabApiException("404 Branch Not Found", 404)

        val e = assertFailsWith<BusinessException> { gitLabService.findBranch(gitCredentials, repository, branchName) }

        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
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

        val e = assertFailsWith<BusinessException> { gitLabService.deleteBranch(gitCredentials, repository, branchName) }

        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should compare branches`() {
        val baseBranch = "base"
        val headBranch = "head"

        every { gitLabClientFactory.buildGitClient(gitCredentials) } returns gitClient
        every { gitClient.repositoryApi.compare(repository, baseBranch, headBranch) } returns CompareResults().apply { commit = Commit()
        commits = listOf(Commit(), Commit()) }

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

        val e = assertFailsWith<BusinessException> { gitLabService.compareBranches(gitCredentials, repository, baseBranch, headBranch) }

        assertEquals(MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND.toString(), e.errorCode.toString())
    }

    @Test
    fun `should return service type`() {
        assertEquals(GitServiceProvider.GITLAB, gitLabService.getProviderType())
    }
}