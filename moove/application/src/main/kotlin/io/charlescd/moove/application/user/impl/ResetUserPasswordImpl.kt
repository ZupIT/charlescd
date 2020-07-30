package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.user.ResetUserPassword
import io.charlescd.moove.application.user.response.UserNewPasswordResponse
import java.util.*
import javax.inject.Named

@Named
class ResetUserPasswordImpl(private val passGenerator: PassayUserPasswordGenerator) : ResetUserPassword {
    override fun execute(id: UUID): UserNewPasswordResponse = UserNewPasswordResponse(passGenerator.create())
}
