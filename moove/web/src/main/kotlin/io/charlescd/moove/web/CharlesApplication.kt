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

package io.charlescd.moove.web

import io.charlescd.moove.api.configuration.ApiConfiguration
import io.charlescd.moove.infrastructure.configuration.InfrastructureConfiguration
import io.charlescd.moove.legacy.moove.config.LegacyMooveConfig
import io.charlescd.moove.legacy.repository.configuration.LegacyRepositoriesConfig
import io.charlescd.moove.metrics.config.MetricsConfig
import io.charlescd.moove.security.config.CharlesSecurityConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.context.annotation.Import

@SpringBootApplication
@EnableFeignClients
@Import(
    CharlesSecurityConfiguration::class,
    ApiConfiguration::class,
    InfrastructureConfiguration::class,
    LegacyRepositoriesConfig::class,
    LegacyMooveConfig::class,
    MetricsConfig::class
)
class CharlesApplication

fun main(args: Array<String>) {
    runApplication<CharlesApplication>(*args)
}
