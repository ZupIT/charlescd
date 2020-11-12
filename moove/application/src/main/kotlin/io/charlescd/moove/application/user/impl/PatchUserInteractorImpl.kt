package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.PatchUserInteractor
import io.charlescd.moove.application.user.request.PatchUserRequest
import io.charlescd.moove.application.user.response.UserResponse
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import javax.inject.Inject
import javax.inject.Named
import org.springframework.beans.factory.annotation.Value

@Named
class PatchUserInteractorImpl @Inject constructor(
    private val userService: UserService,
    private val userRepository: UserRepository,
    @Value("\${charles.internal.idm.enabled:true}") private val internalIdmEnabled: Boolean
) : PatchUserInteractor {

    override fun execute(id: String, patchUserRequest: PatchUserRequest, authorization: String): UserResponse {
        if (internalIdmEnabled) {
            patchUserRequest.validate()
            val user = userRepository.findById(id).orElseThrow { NotFoundException("user", id) }
            val updatedUser = updateUser(patchUserRequest, user)
            return UserResponse.from(updatedUser)
        } else {
            throw BusinessException.of(MooveErrorCode.EXTERNAL_IDM_FORBIDDEN)
        }
    }

    private fun updateUser(patchUserRequest: PatchUserRequest, user: User): User {
        val patched = patchUserRequest.applyPatch(user)
        return userService.update(patched)
    }
}
