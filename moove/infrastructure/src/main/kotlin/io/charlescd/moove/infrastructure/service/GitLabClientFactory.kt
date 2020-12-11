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

    private val defaultAdress = "https://gitlab.com"

    fun buildGitClient(gitCredentials: GitCredentials): GitLabApi {
        var address = gitCredentials.address
        if (address.isEmpty()) {
            address = defaultAdress
        }
        return if (!gitCredentials.accessToken.isNullOrBlank()) {
            GitLabApi(GitLabApi.ApiVersion.V4, address, gitCredentials.accessToken)
                .apply { ignoreCertificateErrors = shouldIgnoreCertificateErrors }
        } else {
            GitLabApi.oauth2Login(address, gitCredentials.username, gitCredentials.password)
                .apply { ignoreCertificateErrors = shouldIgnoreCertificateErrors }
        }
    }
}
