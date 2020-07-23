package io.charlescd.moove.infrastructure.service.client

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestHeader

@FeignClient(name = "keycloakCustomClient", url = "\${charlescd.keycloak.serverUrl}")
interface KeycloakCustomClient {

    @GetMapping(
        value = ["/realms/{realm}/protocol/openid-connect/userinfo"],
        consumes = [MediaType.APPLICATION_JSON_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun userInfo(@PathVariable("realm") realm: String, @RequestHeader("Authorization") authorization: String)
}
