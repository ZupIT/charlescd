package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.GitCredentials
import org.gitlab4j.api.GitLabApi
import org.springframework.stereotype.Component

@Component
class GitLabClientFactory {

    private val defaultAdress = "https://gitlab.com"

    fun buildGitClient(gitCredentials: GitCredentials): GitLabApi {
        var address = gitCredentials.address
        if (address.isEmpty()) {
            address = defaultAdress
        }
        return if (!gitCredentials.accessToken.isNullOrBlank()) {
            GitLabApi(GitLabApi.ApiVersion.V4, address, gitCredentials.accessToken)
        } else {
            GitLabApi.oauth2Login(address, gitCredentials.username, gitCredentials.password)
        }
    }
}
