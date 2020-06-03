/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.security.config

import javax.annotation.PostConstruct
import org.keycloak.OAuth2Constants
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnProperty(value = ["security.enabled"], matchIfMissing = true)
@ComponentScan(basePackages = ["io.charlescd.moove.security"])
class CharlesSecurityConfiguration {

    private val logger = LoggerFactory.getLogger(CharlesSecurityConfiguration::class.java)

    @Value("\${charlescd.keycloak.serverUrl}")
    private lateinit var uri: String

    @Value("\${charlescd.keycloak.realm}")
    private lateinit var realm: String

    @Value("\${charlescd.keycloak.clientId}")
    private lateinit var clientId: String

    @Value("\${charlescd.keycloak.clientSecret}")
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
