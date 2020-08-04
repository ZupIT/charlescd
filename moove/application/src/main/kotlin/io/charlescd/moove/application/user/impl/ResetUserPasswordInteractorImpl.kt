package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserPasswordGeneratorService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.ResetUserPasswordInteractor
import io.charlescd.moove.application.user.response.UserNewPasswordResponse
import io.charlescd.moove.domain.service.KeycloakService
import java.util.*
import javax.inject.Named

@Named
class ResetUserPasswordInteractorImpl(
    private val passGenerator: UserPasswordGeneratorService,
    private val keycloakService: KeycloakService,
    private val userService: UserService
) : ResetUserPasswordInteractor {
    override fun execute(id: UUID): UserNewPasswordResponse {
        val newPassword = passGenerator.create()
        val user = userService.find(id.toString())
        keycloakService.resetPassword(user.email, newPassword)
        return UserNewPasswordResponse(newPassword)
    }
}
