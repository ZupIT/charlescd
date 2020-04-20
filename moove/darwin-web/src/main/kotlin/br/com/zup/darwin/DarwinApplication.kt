/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin

import br.com.zup.charles.api.configuration.ApiConfiguration
import br.com.zup.darwin.security.config.DarwinSecurityConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients
import org.springframework.context.annotation.Import

@SpringBootApplication
@EnableFeignClients
@Import(DarwinSecurityConfiguration::class, ApiConfiguration::class)
class DarwinApplication

fun main(args: Array<String>) {
    runApplication<DarwinApplication>(*args)
}
