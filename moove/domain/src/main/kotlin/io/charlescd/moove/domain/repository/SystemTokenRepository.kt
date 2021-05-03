package io.charlescd.moove.domain.repository

interface SystemTokenRepository {

    fun getIdByTokenValue(tokenValue: String): String?
}
