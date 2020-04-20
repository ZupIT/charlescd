/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.iam.configuration

import org.keycloak.OAuth2Constants
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

@Configuration
class KeycloakConfig {

    private val logger = LoggerFactory.getLogger(KeycloakConfig::class.java)

    @Value("\${darwin.keycloak.serverUrl}")
    private lateinit var uri: String

    @Value("\${darwin.keycloak.realm}")
    private lateinit var realm: String

    @Value("\${darwin.keycloak.clientId}")
    private lateinit var clientId: String

    @Value("\${darwin.keycloak.clientSecret}")
    private lateinit var secretId: String

    @PostConstruct
    fun onStart() {
        logger.info("Keycloak API configured. [URL: $uri, Realm: $realm, ClientId: $clientId]")
    }

    @Bean
    fun keycloakClient(): Keycloak =
        KeycloakBuilder.builder()
            .serverUrl(uri)
            .realm(realm)
            .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
            .clientId(clientId)
            .clientSecret(secretId)
            .build()
}
