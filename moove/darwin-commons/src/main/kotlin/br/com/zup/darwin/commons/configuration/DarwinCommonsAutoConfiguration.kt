/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.configuration

import org.modelmapper.ModelMapper
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock
import javax.annotation.PostConstruct

private val modelMapper = ModelMapper()

@Configuration
class DarwinCommonsAutoConfiguration {

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
