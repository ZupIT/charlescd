package io.charlescd.moove.infrastructure.service.client

import io.charlescd.moove.infrastructure.configuration.SimpleFeignEncoderConfiguration
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader

@FeignClient(name = "keycloakCustomClient", url = "\${charlescd.keycloak.serverUrl}", configuration = [ SimpleFeignEncoderConfiguration::class])
interface KeycloakCustomClient {

    @GetMapping(
        value = ["/realms/{realm}/protocol/openid-connect/userinfo"],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun userInfo(@PathVariable("realm") realm: String, @RequestHeader("Authorization") authorization: String)
}
