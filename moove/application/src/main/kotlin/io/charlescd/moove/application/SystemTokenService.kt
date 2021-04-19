package io.charlescd.moove.application

import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.SystemTokenRepository
import javax.inject.Named

@Named
class SystemTokenService(private val systemTokenRepository: SystemTokenRepository) {

    fun getSystemTokenIdByTokenValue(tokenValue: String): String {
        return this.systemTokenRepository.getIdByTokenValue(tokenValue) ?: throw NotFoundException("system_token", tokenValue)
    }

}
