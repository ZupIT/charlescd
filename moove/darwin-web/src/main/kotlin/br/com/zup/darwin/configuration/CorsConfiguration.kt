/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.EnableWebMvc
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@EnableWebMvc
@Configuration
@ConditionalOnProperty(prefix = "zup.cors", name = ["enabled"], havingValue = "true", matchIfMissing = false)
class CorsConfiguration(
    @Value("\${zup.cors.mapping:/**}") val mapping: String,
    @Value("\${zup.cors.allowed-origins:*}") val allowedOrigins: Array<String>,
    @Value("\${zup.cors.allowed-methods:*}") val allowedMethods: Array<String>,
    @Value("\${zup.cors.allowed-headers:*}") val allowedHeaders: Array<String>,
    @Value("\${zup.cors.exposed-headers:}") val exposedHeaders: Array<String>,
    @Value("\${zup.cors.allow-credentials:false}") val allowCredentials: Boolean,
    @Value("\${zup.cors.max-age:3600}") val maxAge: Long
) : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        super.addCorsMappings(registry)
        registry.addMapping(mapping)
            .allowedOrigins(*allowedOrigins)
            .allowedMethods(*allowedMethods)
            .allowedHeaders(*allowedHeaders)
            .exposedHeaders(*exposedHeaders)
            .allowCredentials(allowCredentials)
            .maxAge(maxAge)
    }
}
