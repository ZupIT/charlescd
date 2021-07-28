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

import javax.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.filter.AbstractRequestLoggingFilter

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

        override fun beforeRequest(request: HttpServletRequest, message: String) {
            log.debug(message)
        }

        override fun afterRequest(request: HttpServletRequest, message: String) {
            log.debug(message)
        }
    }
}
