package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import org.gitlab4j.api.*
import org.gitlab4j.api.models.*
import spock.lang.Specification

class GitLabServiceTest extends Specification {

    private GitLabService gitLabService
    private GitLabClientFactory gitLabClientFactory = Mock(GitLabClientFactory)
    private GitLabApi gitLabApi = Mock(GitLabApi)
    private RepositoryApi repositoryApi = Mock(RepositoryApi)
    private MergeRequestApi mergeRequestApi = Mock(MergeRequestApi)
    private TagsApi tagsApi = Mock(TagsApi)

    private MergeRequestFilter mergeRequestFilter
    private MergeRequest mergeRequest

    void setup() {
        this.gitLabService = new GitLabService(gitLabClientFactory)
        this.mergeRequestFilter = new MergeRequestFilter()
        this.mergeRequest = new MergeRequest()
    }

    def "when trying to create branch if it does not exist should create it"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def newBranchName = "new-branch"
        def baseBranchName = "master"
        def branch = new Branch()
        branch.name = newBranchName

        when:
        def createdBranch = gitLabService.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        assert createdBranch.get().equals(newBranchName)
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.createBranch(repositoryName, newBranchName, baseBranchName) >> branch
    }

    def "when trying to create branch if base branch does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def newBranchName = "new-branch"
        def baseBranchName = "master"
        def branch = new Branch()
        branch.name = newBranchName

        when:
        gitLabService.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.createBranch(repositoryName, newBranchName, baseBranchName) >> { throw new GitLabApiException("Invalid reference name", 400) }

        def exception = thrown(BusinessException.class)

        assert exception.errorCode == MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND
    }

    def "when trying to create branch if branch already exists should not create a duplicated branch and should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def newBranchName = "new-branch"
        def baseBranchName = "master"
        def branch = new Branch()
        branch.name = newBranchName

        when:
        gitLabService.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.createBranch(repositoryName, newBranchName, baseBranchName) >> { throw new GitLabApiException("Branch already exists", 400) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_DUPLICATED_BRANCH
    }

    def "when trying to merge branches if already exists a merge request, should get it and merge it"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        mergeRequest.iid = 1

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        2 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> [mergeRequest]
        1 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid)
    }

    def "when  there is no merge request should create a new merge request"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        3 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> []
        1 * mergeRequestApi.createMergeRequest(repositoryName, headBranchName, baseBranchName, "MERGE $headBranchName into $baseBranchName",
                GitLabService.COMMIT_MESSAGE, null) >> mergeRequest
        1 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid)
    }

    def "when trying to merge branches, if there is a merge request and it's unable to merge should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        mergeRequest.iid = 1
        mergeRequest.mergeStatus = "cannot_be_merged"

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> [mergeRequest]
        0 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid)

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_MERGE_CONFLICT
    }

    def "when trying to merge branches, if there is necessary to create a merge request and it's unable to merge should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        mergeRequest.mergeStatus = "cannot_be_merged"

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        2 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> []
        1 * mergeRequestApi.createMergeRequest(repositoryName, headBranchName, baseBranchName, "MERGE $headBranchName into $baseBranchName",
                GitLabService.COMMIT_MESSAGE, null) >> mergeRequest
        0 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid)

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_MERGE_CONFLICT
    }

    def "when trying to merge branches should not merge them if repository does not exist"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> { throw new GitLabApiException("", 404) }
        0 * mergeRequestApi.createMergeRequest(repositoryName, headBranchName, baseBranchName, "MERGE $headBranchName into $baseBranchName",
                GitLabService.COMMIT_MESSAGE, null) >> mergeRequest
        0 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid)

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND
    }

    def "when trying to merge branches should not merge them if merge acceptance request fails"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        mergeRequestFilter.sourceBranch = headBranchName
        mergeRequestFilter.targetBranch = baseBranchName
        mergeRequestFilter.state = Constants.MergeRequestState.OPENED

        when:
        gitLabService.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        3 * gitLabApi.getMergeRequestApi() >> mergeRequestApi
        1 * mergeRequestApi.getMergeRequests(_) >> []
        1 * mergeRequestApi.createMergeRequest(repositoryName, headBranchName, baseBranchName, "MERGE $headBranchName into $baseBranchName",
                GitLabService.COMMIT_MESSAGE, null) >> mergeRequest
        1 * mergeRequestApi.acceptMergeRequest(repositoryName, mergeRequest.iid) >> { throw new GitLabApiException("Method Not Allowed", 405) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_MERGE_ERROR
    }

    def "when trying to create a new release should do it successfully"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        when:
        gitLabService.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        2 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.createTag(repositoryName, releaseName, sourceBranch, GitLabService.RELEASE_DESCRIPTION, description) >> tag
        1 * tagsApi.createRelease(repositoryName, releaseName, GitLabService.RELEASE_DESCRIPTION) >> release
    }

    def "when trying to create a new release but it already exists should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        when:
        gitLabService.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.createTag(repositoryName, releaseName, sourceBranch, GitLabService.RELEASE_DESCRIPTION, description) >> { throw new GitLabApiException("Tag $releaseName already exists", 400) }
        0 * tagsApi.createRelease(repositoryName, releaseName, GitLabService.RELEASE_DESCRIPTION) >> release

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_DUPLICATED_TAG
    }

    def "when trying to create a new release but repository does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        when:
        gitLabService.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.createTag(repositoryName, releaseName, sourceBranch, GitLabService.RELEASE_DESCRIPTION, description) >> { throw new GitLabApiException("", 404) }
        0 * tagsApi.createRelease(repositoryName, releaseName, GitLabService.RELEASE_DESCRIPTION) >> release

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND
    }

    def "when trying to create a new release but source branch does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        when:
        gitLabService.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.createTag(repositoryName, releaseName, sourceBranch, GitLabService.RELEASE_DESCRIPTION, description) >> { throw new GitLabApiException("Target $sourceBranch is invalid", 400) }
        0 * tagsApi.createRelease(repositoryName, releaseName, GitLabService.RELEASE_DESCRIPTION) >> release

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_BASE_NOT_FOUND
    }

    def "when trying to find a release if it exists should return it successfully"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION
        tag.release = release

        when:
        def releaseReceived = gitLabService.findRelease(gitCredentials, repositoryName, releaseName)

        then:
        assert releaseReceived.get() != null
        assert releaseReceived.get().equals(releaseName)

        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.getTag(repositoryName, releaseName) >> tag
    }

    def "when trying to find a release if it does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def releaseName = "release-name"

        def release = new Release()
        release.tagName = releaseName
        release.description = GitLabService.RELEASE_DESCRIPTION

        def tag = new Tag()
        tag.name = releaseName
        tag.message = GitLabService.RELEASE_DESCRIPTION
        tag.release = release

        when:
        gitLabService.findRelease(gitCredentials, repositoryName, releaseName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getTagsApi() >> tagsApi
        1 * tagsApi.getTag(repositoryName, releaseName) >> { throw new GitLabApiException("404 Tag Not Found", 404) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_TAG_NOT_FOUND
    }

    def "when trying to find a branch by name if it exists should return it successfully"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        def branch = new Branch()
        branch.name = branchName

        when:
        def branchReceived = gitLabService.findBranch(gitCredentials, repositoryName, branchName)

        then:
        assert branchReceived.get() != null
        assert branchReceived.get() == (branchName)

        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.getBranch(repositoryName, branchName) >> branch
    }

    def "when trying to find a branch by name if it does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        def branch = new Branch()
        branch.name = branchName

        when:
        gitLabService.findBranch(gitCredentials, repositoryName, branchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.getBranch(repositoryName, branchName) >> { throw new GitLabApiException("404 Branch Not Found", 404) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND
    }

    def "when trying to delete a branch by name if it exists should delete it successfully"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        def branch = new Branch()
        branch.name = branchName

        when:
        gitLabService.deleteBranch(gitCredentials, repositoryName, branchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.deleteBranch(repositoryName, branchName) >> _
    }

    def "when trying to delete a branch by name if it does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        def branch = new Branch()
        branch.name = branchName

        when:
        gitLabService.deleteBranch(gitCredentials, repositoryName, branchName)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.deleteBranch(repositoryName, branchName) >> { throw new  GitLabApiException("404 Branch Not Found", 404) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND
    }

    def "when trying to compare branches if they exist should do it successfully"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        def compareResults = new CompareResults()
        compareResults.commits = [new Commit()]

        when:
        def compareResultsReceived = gitLabService.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:
        assert compareResultsReceived != null
        assert compareResultsReceived.aheadBy == 0
        assert compareResultsReceived.baseBranch == baseBranch
        assert compareResultsReceived.headBranch == headBranch
        assert compareResultsReceived.repository == repositoryName
        assert compareResultsReceived.behindBy == compareResults.commits.size()

        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.compare(repositoryName, baseBranch, headBranch) >> compareResults
    }

    def "when trying to compare branches if base branch does not exist should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        when:
        gitLabService.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.compare(repositoryName, baseBranch, headBranch) >> { throw new GitLabApiException("404 Branch Not Found", 404) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_BRANCH_NOT_FOUND
    }

    def "when trying to compare branches if token does not have access should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        when:
        gitLabService.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.compare(repositoryName, baseBranch, headBranch) >> { throw new GitLabApiException("", 403) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_FORBIDDEN
    }

    def "when trying to compare branches if an unexpected error happens should throw exception"() {
        given:
        def gitCredentials = new GitCredentials("https://gitlab.com", null, null, "token", GitServiceProvider.GITLAB)
        def repositoryName = "repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        when:
        gitLabService.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:
        1 * gitLabClientFactory.buildGitClient(gitCredentials) >> gitLabApi
        1 * gitLabApi.getRepositoryApi() >> repositoryApi
        1 * repositoryApi.compare(repositoryName, baseBranch, headBranch) >> { throw new GitLabApiException("", 500) }

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_INTEGRATION_ERROR
    }

}
