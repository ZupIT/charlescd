package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.GitCredentials
import org.gitlab4j.api.GitLabApi
import org.springframework.stereotype.Component

@Component
class GitLabClientFactory {

    fun buildGitClient(gitCredentials: GitCredentials): GitLabApi {
        return if (!gitCredentials.accessToken.isNullOrBlank()) {
            GitLabApi(GitLabApi.ApiVersion.V4, gitCredentials.address, gitCredentials.accessToken)
        } else {
            GitLabApi.oauth2Login(gitCredentials.address, gitCredentials.username, gitCredentials.password)
        }
    }
}
