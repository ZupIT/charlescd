package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserPasswordGeneratorService
import io.charlescd.moove.application.user.ResetUserPasswordInteractor
import io.charlescd.moove.application.user.response.UserNewPasswordResponse
import io.charlescd.moove.domain.service.KeycloakService
import java.util.*
import javax.inject.Named

@Named
class ResetUserPasswordInteractorImpl(
    private val passGenerator: UserPasswordGeneratorService,
    private val keycloakService: KeycloakService
) : ResetUserPasswordInteractor {
    override fun execute(id: UUID): UserNewPasswordResponse {
        val newPassword = passGenerator.create()
        keycloakService.resetPassword(id.toString(), newPassword)
        return UserNewPasswordResponse(newPassword)
    }
}
