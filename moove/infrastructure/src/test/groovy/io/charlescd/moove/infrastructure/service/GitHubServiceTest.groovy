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

package io.charlescd.moove.infrastructure.service


import com.google.gson.JsonObject
import io.charlescd.moove.domain.GitCredentials
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.RepositoryCommitCompare
import org.eclipse.egit.github.core.User
import org.eclipse.egit.github.core.client.GitHubClient
import org.eclipse.egit.github.core.client.GitHubResponse
import org.eclipse.egit.github.core.service.CommitService
import org.eclipse.egit.github.core.service.DataService
import org.eclipse.egit.github.core.service.RepositoryService
import org.eclipse.egit.github.core.service.UserService
import spock.lang.Specification

class GitHubServiceTest extends Specification {

    private GitHubService gitHubService;
    private GitHubClientFactory gitHubClientFactory = Mock(GitHubClientFactory)
    private RepositoryService repositoryService = Mock(RepositoryService)
    private DataService dataService = Mock(DataService)
    private UserService userService = Mock(UserService)
    private CommitService commitService = Mock(CommitService)
    private GitHubClient gitHubClient = new GitHubClient()
    private GitCredentials gitCredentials

    void setup() {
        this.gitHubService = new GitHubService(gitHubClientFactory)
        this.gitCredentials = new GitCredentials("https://github.com", "user", "password", "", GitServiceProvider.GITHUB)
    }

    def "when trying to test connection  if does not work by userService problems return 'false'"() {
        given:
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        def testConnection = spy.testConnection(gitCredentials)

        then:

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getUserService(gitHubClient) >> userService
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * userService.user >> null
        assert !testConnection
    }

    def "when trying to test connection if does not work by repository problems return 'false'"() {
        given:
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        def testConnection = spy.testConnection(gitCredentials)

        then:

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getUserService(gitHubClient) >> userService
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * userService.user >> new User()
        1 * repositoryService.repositories >> null
        assert !testConnection
    }

    def "when trying to test connection if fails should throw an Exception"() {
        given:
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        def testConnection = spy.testConnection(gitCredentials)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> null

        def exception = thrown(RuntimeException.class)
    }

    def "when trying to test connection  if works return 'true'"() {
        given:
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        def testConnection = spy.testConnection(gitCredentials)

        then:

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getUserService(gitHubClient) >> userService
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * userService.user >> new User()
        1 * repositoryService.repositories >> new ArrayList<>()
        assert testConnection
    }

    def "when trying to merge branches should do it successfully"() {
        given:
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)
        when:
        spy.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getRepositoryService(gitClientSpy) >> repositoryService
        1 * repositoryService.getClient() >> gitClientSpy
        1 * gitClientSpy.post(_,_,_) >> null
    }

    def "when trying to merge branches should not merge them if connection fails"() {
        given:
        def repositoryName = "repository-name"
        def baseBranchName = "master"
        def headBranchName = "head-branch"

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        spy.mergeBranches(gitCredentials, repositoryName, baseBranchName, headBranchName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * repositoryService.getClient() >> gitHubClient

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND
    }

    def "when trying to create branch if it does not exist should create it"() {
        given:
        def repositoryName = "tester/repository-name-tests"
        def newBranchName = "new-branch"
        def baseBranchName = "master"

        def reference = new Reference()
        reference.setRef("refs/heads/"+baseBranchName)
        reference.setUrl("refs/heads/branch")

        def retReference = new Reference()
        retReference.setRef("refs/heads/"+newBranchName)
        retReference.setUrl("refs/heads/branch")

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        def createdBranch = spy.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        assert createdBranch.get().equals(newBranchName)
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getDataService(gitClientSpy) >> dataService
        1 * dataService.getReference(_, _) >> reference
        1 * dataService.createReference(_, _) >> retReference
    }

    def "when trying to create branch if it cannot find base-branch repo, should raise an exception"() {
        given:
        def repositoryName = "tester/repository-name-tests"
        def newBranchName = "new-branch"
        def baseBranchName = ""

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        def createdBranch = spy.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getDataService(gitClientSpy) >> dataService
        1 * dataService.getReference(_, _) >> new Reference()

        thrown(RuntimeException.class)
    }

    def "when trying to create a new release should do it successfully"() {
        given:
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"
        JsonObject result = new JsonObject()
        result.addProperty("name", releaseName)

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        def createdRelease = spy.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        assert createdRelease.get() == releaseName
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getRepositoryService(gitClientSpy) >> repositoryService
        1 * repositoryService.getClient() >> gitClientSpy
        1 * gitClientSpy.post(_,_,_) >> result
    }

    def "when trying to create a new release if the connection fails throw exception"() {
        given:
        def repositoryName = "repository-name"
        def releaseName = "release-name"
        def sourceBranch = "source-branch"
        def description = "description"
        JsonObject result = new JsonObject()
        result.addProperty("name", releaseName)

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        spy.createRelease(gitCredentials, repositoryName, releaseName, sourceBranch, description)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getRepositoryService(gitClientSpy) >> repositoryService

        thrown(RuntimeException.class)
    }

    def "when trying to find a release should do it successfully"() {
        given:
        def repositoryName = "repository-name"
        def releaseName = "release-name"

        JsonObject result = new JsonObject()
        result.addProperty("name", releaseName)

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)
        GitHubResponse response = Mock(GitHubResponse)

        when:
        def releaseReceived = spy.findRelease(gitCredentials, repositoryName, releaseName)

        then:
        assert releaseReceived.get() != null
        assert releaseReceived.get().equals(releaseName)

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getRepositoryService(gitClientSpy) >> repositoryService
        1 * repositoryService.getClient() >> gitClientSpy
        1 * gitClientSpy.get(_) >> response
        1 * response.getBody() >> result

    }

    def "when trying to find a release if the connection fails throw exception"() {
        given:
        def repositoryName = "repository-name"
        def releaseName = "release-name"

        JsonObject result = new JsonObject()
        result.addProperty("name", releaseName)

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubResponse response = Mock(GitHubResponse)

        when:
        spy.findRelease(gitCredentials, repositoryName, releaseName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * repositoryService.getClient() >> gitHubClient

        thrown(RuntimeException.class)
    }

    def "when trying to find a branch by name if it exists should return it successfully"() {
        given:
        def repositoryName = "tests/repository-name"
        def branchName = "branch-name"

        def reference = new Reference()
        reference.setRef("refs/heads/"+branchName)
        reference.setUrl("refs/heads/branch")

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        def branchReceived = spy.findBranch(gitCredentials, repositoryName, branchName)

        then:
        assert branchReceived.get() != null
        assert branchReceived.get() == (branchName)

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getDataService(gitClientSpy) >> dataService
        1 * dataService.getReference(_,_) >> reference
    }

    def "when trying to find a branch by name if it not exists should throw exception"() {
        given:
        def repositoryName = "tests/repository-name"
        def branchName = "branch-name"

        def reference = new Reference()
        reference.setRef("refs/heads/"+branchName)
        reference.setUrl("refs/heads/branch")

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        spy.findBranch(gitCredentials, repositoryName, branchName)

        then:

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getDataService(gitHubClient) >> dataService

        thrown(RuntimeException.class)
    }

    def "when trying to delete a branch by name if it exists should delete it successfully"() {
        given:
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        spy.deleteBranch(gitCredentials, repositoryName, branchName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getRepositoryService(gitClientSpy) >> repositoryService
        1 * repositoryService.getClient() >> gitClientSpy
        1 * gitClientSpy.delete(_) >> null
    }

    def "when trying to delete a branch by name if it does not exist should throw exception"() {
        given:
        def repositoryName = "repository-name"
        def branchName = "branch-name"

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])

        when:
        spy.deleteBranch(gitCredentials, repositoryName, branchName)

        then:
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getRepositoryService(gitHubClient) >> repositoryService
        1 * repositoryService.getClient() >> gitHubClient

        def exception = thrown(BusinessException.class)
        assert exception.errorCode == MooveErrorCode.GIT_ERROR_REPOSITORY_NOT_FOUND
    }

    def "when trying to compare branches if they exist should do it successfully"() {
        given:
        def repositoryName = "tests/repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        RepositoryCommitCompare compare = new RepositoryCommitCompare()
        compare.setAheadBy(0)
        compare.setBehindBy(1)
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        when:
        def compareResultsReceived = spy.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:
        assert compareResultsReceived != null
        assert compareResultsReceived.aheadBy == 0
        assert compareResultsReceived.baseBranch == baseBranch
        assert compareResultsReceived.headBranch == headBranch
        assert compareResultsReceived.repository == repositoryName
        assert compareResultsReceived.behindBy == 1

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getCommitService(gitHubClient) >> commitService
        1 * commitService.compare(_,_,_) >> compare
    }

    def "when trying to compare branches if they don't exist should throw exception"() {
        given:
        def repositoryName = "tests/repository-name"
        def baseBranch = "base-branch"
        def headBranch = "head-branch"

        RepositoryCommitCompare compare = new RepositoryCommitCompare()
        compare.setAheadBy(0)
        compare.setBehindBy(1)
        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        when:
        spy.compareBranches(gitCredentials, repositoryName, baseBranch, headBranch)

        then:

        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        1 * spy.getCommitService(gitHubClient) >> commitService
        1 * commitService.compare(_,_,_) >> null

        def exception = thrown(RuntimeException.class)
    }

    def "when trying to get userService should do it successfully"() {

        when:
        def service = gitHubService.getUserService(gitHubClient)

        then:
        assert service != null
    }

    def "when trying to get repositoryService should do it successfully"() {

        when:
        def service = gitHubService.getRepositoryService(gitHubClient)

        then:
        assert service != null
    }

    def "when trying to get dataService should do it successfully"() {

        when:
        def service = gitHubService.getDataService(gitHubClient)

        then:
        assert service != null
    }

    def "when trying to get commitService should do it successfully"() {

        when:
        def service = gitHubService.getCommitService(gitHubClient)

        then:
        assert service != null
    }

 	def "when trying to create branch if it does not exist should create it with main as base"() {
        given:
        def repositoryName = "tester/repository-name-tests"
        def newBranchName = "new-branch"
        def baseBranchName = "main"

        def reference = new Reference()
        reference.setRef("refs/heads/"+baseBranchName)
        reference.setUrl("refs/heads/branch")

        def retReference = new Reference()
        retReference.setRef("refs/heads/"+newBranchName)
        retReference.setUrl("refs/heads/branch")

        GitHubService spy = Spy(GitHubService, constructorArgs: [gitHubClientFactory])
        GitHubClient gitClientSpy = Spy(GitHubClient)

        when:
        def createdBranch = spy.createBranch(gitCredentials, repositoryName, newBranchName, baseBranchName)

        then:
        assert createdBranch.get().equals(newBranchName)
        1 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitClientSpy
        1 * spy.getDataService(gitClientSpy) >> dataService
        1 * dataService.getReference(_, _) >> reference
        1 * dataService.createReference(_, _) >> retReference
    }
}
