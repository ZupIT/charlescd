package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.GitCredentials
import org.gitlab4j.api.GitLabApi
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class GitLabClientFactory(
    @Value("#{environment.GITLAB_IGNORE_CERTIFICATE_ERRORS ?: false}")
    val shouldIgnoreCertificateErrors: Boolean
) {

    fun buildGitClient(gitCredentials: GitCredentials): GitLabApi {
        return if (!gitCredentials.accessToken.isNullOrBlank()) {
            GitLabApi(GitLabApi.ApiVersion.V4, gitCredentials.address, gitCredentials.accessToken)
                .apply { ignoreCertificateErrors = shouldIgnoreCertificateErrors }
        } else {
            GitLabApi.oauth2Login(gitCredentials.address, gitCredentials.username, gitCredentials.password)
                .apply { ignoreCertificateErrors = shouldIgnoreCertificateErrors }
        }
    }
}
