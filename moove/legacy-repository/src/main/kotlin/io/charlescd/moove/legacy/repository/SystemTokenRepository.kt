package io.charlescd.moove.legacy.repository

import io.charlescd.moove.legacy.repository.entity.SystemToken
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface SystemTokenRepository : JpaRepository<SystemToken, String> {

    fun findByToken(token: String): Optional<SystemToken>

}
