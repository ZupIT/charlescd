package io.charlescd.moove.application.user

import io.charlescd.moove.application.user.request.PatchUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import java.util.*

interface PatchUserInteractor {

    fun execute(id: String, patchUserRequest: PatchUserRequest, authorization: String): UserResponse
}
