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

package io.charlescd.moove.legacy.moove.api.config

import com.google.gson.Gson
import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy
import io.charlescd.moove.commons.exceptions.IntegrationExceptionLegacy
import io.charlescd.moove.commons.exceptions.ThirdPartyIntegrationExceptionLegacy
import java.io.Serializable
import java.lang.IllegalArgumentException

class VillagerErrorDecoder : ErrorDecoder {
    override fun decode(methodKey: String?, response: Response?): Exception {
        response?.let {
            val fromJson = Gson().fromJson<ResponseError>(it.body().toString(), ResponseError::class.java)

            checkBadRequest(it.status(), fromJson)

            checkThirdPartyIntegrationError(it.status(), fromJson)

            checkCommunicationServerError(it.status(), fromJson)
        }

        throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_UNEXPECTED_ERROR, "")
    }

    private fun checkBadRequest(httpStatus: Int, response: ResponseError) {
        if (httpStatus == 400) {
            throw IllegalArgumentException(response.message)
        }
    }

    private fun checkThirdPartyIntegrationError(httpStatus: Int, response: ResponseError) {
        if (httpStatus == 500 && response.code.isNotBlank() && response.code.contains("Third", true)) {
            throw ThirdPartyIntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTERNAL_INTEGRATION_ERROR, response.message)
        }
    }

    private fun checkCommunicationServerError(httpStatus: Int, response: ResponseError) {
        if (httpStatus == 503 || httpStatus == 502 || httpStatus == 504) {
            throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, response.message)
        }
    }

    data class ResponseError(
        val code: String,
        val message: String
    ) : Serializable
}
