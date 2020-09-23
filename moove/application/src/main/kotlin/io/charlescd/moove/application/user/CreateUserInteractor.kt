package io.charlescd.moove.application.user

import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.application.user.response.UserResponse

interface CreateUserInteractor {

    fun execute(createUserRequest: CreateUserRequest, authorization: String): UserResponse
}
