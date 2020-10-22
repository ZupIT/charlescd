package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.CreateUserInteractor
import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.ForbiddenException
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
        val password = createUserRequest.password
        val emailFromToken = keycloakService.getEmailByAccessToken(authorization)
        val userFromToken = userRepository.findByEmail(emailFromToken)

        userFromToken.ifPresentOrElse({
            createUserWhenUserFromTokenExists(it, newUser, password)
        }, {
            createOwnUser(emailFromToken, newUser, password)
        })

        return UserResponse.from(newUser)
    }

    private fun createOwnUser(emailFromToken: String, newUser: User, password: String?) {
        if (emailFromToken == newUser.email) {
            saveUser(newUser.copy(root = false), password)
        } else {
            throw ForbiddenException()
        }
    }

    private fun createUserWhenUserFromTokenExists(it: User, newUser: User, password: String?) {
        if (it.root) {
            saveUser(newUser, password)
        } else {
            throw ForbiddenException()
        }
    }

    private fun saveUser(newUser: User, password: String?) {
        userService.checkIfEmailAlreadyExists(newUser)
        userService.save(newUser)

        if (internalIdmEnabled) {
            saveUserOnKeycloak(newUser, password)
        }
    }

    private fun saveUserOnKeycloak(user: User, password: String?) {
        val validPassword = password ?: throw BusinessException.of(MooveErrorCode.MISSING_PARAMETER)
        this.keycloakService.createUser(
            user.email,
            user.name,
            validPassword
        )
    }
}
