package io.charlescd.moove.legacy.repository

import io.charlescd.moove.legacy.repository.entity.SystemToken
import java.util.*
import org.springframework.data.jpa.repository.JpaRepository

interface SystemTokenRepository : JpaRepository<SystemToken, String> {

    fun findByToken(token: String): Optional<SystemToken>
}
