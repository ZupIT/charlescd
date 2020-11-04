package io.charlescd.moove.security.service

import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import io.charlescd.moove.domain.service.SecurityService
import org.springframework.stereotype.Service

@Service
class SecurityServiceImpl(
    val keycloakService: KeycloakService,
    var userRepository: UserRepository
): SecurityService {

    override fun getAuthorId(authorization: String): String {
        val user = getUserByToken(authorization)
        return  user.id
    }

    private fun getUserByToken(authorization:String): User {
        val email = keycloakService.getEmailByAccessToken(authorization)
        return userRepository
            .findByEmail(email).orElseThrow {
                NotFoundException("user", email)
            }
    }



}
