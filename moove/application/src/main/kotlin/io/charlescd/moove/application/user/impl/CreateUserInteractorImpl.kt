package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.CreateUserInteractor
import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.UnauthorizedException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import javax.inject.Inject
import javax.inject.Named
import org.springframework.beans.factory.annotation.Value

@Named
class CreateUserInteractorImpl @Inject constructor(
    private val userService: UserService,
    private val userRepository: UserRepository,
    private val keycloakService: KeycloakService,
    @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean
) : CreateUserInteractor {

    override fun execute(createUserRequest: CreateUserRequest, authorization: String): UserResponse {
        val newUser = createUserRequest.toUser()
        val parsedEmail = keycloakService.getEmailByAccessToken(authorization)
        val userFromToken = userRepository.findByEmail(parsedEmail)

        if (userFromToken.isPresent) {
            if (userFromToken.get().root) {
                saveUser(newUser, createUserRequest)
            } else {
                throw UnauthorizedException()
            }
        } else {
            if (parsedEmail == newUser.email) {
                saveUser(newUser.copy(root = false), createUserRequest)
            } else {
                throw UnauthorizedException()
            }
        }
        return UserResponse.from(newUser)
    }

    private fun saveUser(newUser: User, createUserRequest: CreateUserRequest) {
        userService.checkIfEmailAlreadyExists(newUser)
        userService.save(newUser)

        if (internalIdmEnabled) {
            saveUserOnKeycloak(createUserRequest, newUser)
        }
    }

    private fun saveUserOnKeycloak(createUserRequest: CreateUserRequest, user: User) {
        val password = createUserRequest.password ?: throw BusinessException.of(MooveErrorCode.MISSING_PARAMETER)
        this.keycloakService.createUser(
            user.email,
            user.name,
            password,
            user.root
        )
    }
}
