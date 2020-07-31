package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.service.KeycloakCustomService
import io.charlescd.moove.infrastructure.service.client.KeycloakCustomClient
import org.keycloak.admin.client.Keycloak
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class KeycloakCustomClientService(val keycloakCustomClient: KeycloakCustomClient, val keycloak: Keycloak) : KeycloakCustomService {

    @Value("\${charlescd.keycloak.realm}")
    lateinit var realm: String

    override fun hitUserInfo(authorization: String) {
        this.keycloakCustomClient.userInfo(this.realm, authorization)
    }
}
