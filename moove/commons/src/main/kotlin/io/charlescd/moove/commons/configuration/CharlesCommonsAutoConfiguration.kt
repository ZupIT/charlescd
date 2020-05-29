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

package io.charlescd.moove.commons.configuration

import org.modelmapper.ModelMapper
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock
import javax.annotation.PostConstruct

private val modelMapper = ModelMapper()

@Configuration
class CharlesCommonsAutoConfiguration {

    private companion object {
        val logger = LoggerFactory.getLogger(this::class.java)!!
    }

    @PostConstruct
    fun postConstruct() {
        logger.debug("${this::class.java.simpleName} auto configuration started")
    }

    @Bean
    @ConditionalOnMissingBean
    fun modelMapper() = modelMapper

    @Bean
    fun clock(): Clock = Clock.systemDefaultZone()
}
