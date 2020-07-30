package io.charlescd.moove.domain.service

interface KeycloakCustomService {

    fun hitUserInfo(authorization: String)

    fun resetPassword(id: String, newPassword: String)
}
