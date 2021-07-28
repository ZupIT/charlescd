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

package io.charlescd.moove.web.configuration

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
