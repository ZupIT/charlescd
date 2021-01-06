package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.configuration.GitConnectionStatusConfigurationInteractor
import io.charlescd.moove.application.configuration.request.GitCredentialsData
import io.charlescd.moove.application.configuration.request.TestConnectionGitConfigurationRequest
import io.charlescd.moove.application.configuration.response.GitConnectionResponse
import io.charlescd.moove.domain.GitServiceProvider
import io.charlescd.moove.infrastructure.mapper.GitServiceMapper
import io.charlescd.moove.infrastructure.service.GitLabService
import spock.lang.Specification

class GitConnectionStatusInteractorImplTest extends Specification {

    private GitConnectionStatusConfigurationInteractor gitConnectionStatusConfigurationInteractor
    private GitServiceMapper gitServiceMapper = Mock(GitServiceMapper)
    private GitLabService gitLabService = Mock(GitLabService)

    void setup() {
        this.gitConnectionStatusConfigurationInteractor = new GitConnectionStatusConfigurationInteractorImpl(gitServiceMapper)
    }

    def "when git connection does not works should return 'failed' as response"() {
        given:
        def request = new TestConnectionGitConfigurationRequest(
                new GitCredentialsData("https://gitlab.com",
                        "",
                        "",
                        "ABCDEFGHIJ",
                        GitServiceProvider.GITLAB)
        )

        def gitConnectionResponse = new GitConnectionResponse("FAILED")

        when:
        def response = this.gitConnectionStatusConfigurationInteractor.execute(request)

        then:
        1 * this.gitServiceMapper.getByType(GitServiceProvider.GITLAB) >> gitLabService
        1 * gitLabService.testConnection(request.credentials.toGitCredentials()) >> false

        assert response != null
        assert response.status == gitConnectionResponse.status
    }

    def "when git connection work should return 'success' as response"() {
        given:
        def request = new TestConnectionGitConfigurationRequest(
                new GitCredentialsData("https://gitlab.com",
                        "",
                        "",
                        "ABCDEFGHIJ",
                        GitServiceProvider.GITLAB)
        )

        def gitConnectionResponse = new GitConnectionResponse("SUCCESS")

        when:
        def response = this.gitConnectionStatusConfigurationInteractor.execute(request)

        then:
        1 * this.gitServiceMapper.getByType(GitServiceProvider.GITLAB) >> gitLabService
        1 * gitLabService.testConnection(request.credentials.toGitCredentials()) >> true

        assert response != null
        assert response.status == gitConnectionResponse.status
    }
}
