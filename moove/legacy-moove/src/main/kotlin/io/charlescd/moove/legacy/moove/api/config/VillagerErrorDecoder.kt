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
import java.lang.IllegalArgumentException

class VillagerErrorDecoder : ErrorDecoder {
    override fun decode(methodKey: String?, response: Response?): Exception {
        response?.let {
            val fromJson = Gson().fromJson<ResponseError>(it.body().toString(), ResponseError::class.java)

            if (it.status() == 400) {
                throw IllegalArgumentException(fromJson.message)
            }

            throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, fromJson.message)
        }
        throw IntegrationExceptionLegacy.of(MooveErrorCodeLegacy.VILLAGER_INTEGRATION_ERROR, "")
    }

    data class ResponseError(
        val message: String
    )
}
