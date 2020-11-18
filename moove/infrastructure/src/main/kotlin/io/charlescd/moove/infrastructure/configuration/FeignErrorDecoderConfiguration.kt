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

package io.charlescd.moove.infrastructure.configuration

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import org.slf4j.LoggerFactory
import java.lang.Exception
import java.lang.IllegalArgumentException
import java.lang.RuntimeException
import java.nio.charset.StandardCharsets
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.util.StreamUtils
import java.io.IOException

@Configuration
class FeignErrorDecoderConfiguration {

    @Bean
    fun errorDecoder(): ErrorDecoder {
        return CustomErrorDecoder()
    }
}

class CustomErrorDecoder : ErrorDecoder {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    override fun decode(methodKey: String?, response: Response?): Exception {
        val responseMessage: String? = this.extractMessageFromResponse(response)
        return when (response?.status()) {
            400 -> IllegalArgumentException(responseMessage)
            422 -> BusinessException.of(MooveErrorCode.INVALID_PAYLOAD, responseMessage ?: response.reason())
            else -> RuntimeException(responseMessage ?: response?.reason())
        }
    }

    private fun extractMessageFromResponse(response: Response?): String? {
        var message: String? = null
        try {
            message = response?.body()?.let {
                StreamUtils.copyToString(it.asInputStream(), StandardCharsets.UTF_8)
            }
            val objectResponse = jacksonObjectMapper().readValue(message, ErrorResponse::class.java)
             return objectResponse.message?.toString()
        } catch (ex: IOException) {
            logger.error(ex.message, ex)
            return message ?: "Error reading response of request"
        }
    }
}

data class ErrorResponse(
    val statusCode: String,
    val message: Any?,
    val error: String
) {

}
