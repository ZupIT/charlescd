/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.configuration

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.AbstractRequestLoggingFilter
import javax.servlet.http.HttpServletRequest

@Configuration
class RequestLoggerConfig {

    @Bean
    fun requestLoggingFilter(): CustomRequestLogger {
        return CustomRequestLogger()
            .apply { setMaxPayloadLength(5000) }
            .apply { setIncludeClientInfo(true) }
            .apply { setIncludeQueryString(true) }
            .apply { setIncludePayload(true) }
            .apply { setIncludeHeaders(true) }
    }

    class CustomRequestLogger : AbstractRequestLoggingFilter() {

        private val log = LoggerFactory.getLogger(this.javaClass)

        override fun shouldLog(request: HttpServletRequest): Boolean =
            !request.requestURL.contains("/actuator")

        override fun afterRequest(request: HttpServletRequest, message: String) {
            log.debug(message)
        }

        override fun beforeRequest(request: HttpServletRequest, message: String) {
            log.debug(message)
        }
    }
}
