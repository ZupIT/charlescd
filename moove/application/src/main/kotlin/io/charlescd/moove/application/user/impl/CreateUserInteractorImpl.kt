package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.CreateUserInteractor
import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named

@Named
class CreateUserInteractorImpl @Inject constructor(
    private val userService: UserService,
    private val keycloakService: KeycloakService
) : CreateUserInteractor {

    override fun execute(createUserRequest: CreateUserRequest): UserResponse {
        val user = createUserRequest.toUser()
        userService.checkIfEmailAlreadyExists(user)
        userService.save(user)

        this.keycloakService.createUser(
            user.email,
            user.name,
            createUserRequest.password,
            user.root
        )

        return UserResponse.from(user)
    }
}
