/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.config

import org.slf4j.LoggerFactory
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.context.annotation.Configuration
import javax.annotation.PostConstruct

//Configuration

@Configuration
@EnableFeignClients
class MooveConfig {
    private companion object {
        val logger = LoggerFactory.getLogger(this::class.java)!!
    }

    @PostConstruct
    fun postContruct() {
        logger.info("Initialized Moove config")
    }
}
