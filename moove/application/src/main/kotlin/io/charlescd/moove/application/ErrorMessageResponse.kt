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

package io.charlescd.moove.application

import com.fasterxml.jackson.annotation.JsonInclude
import io.charlescd.moove.domain.MooveErrorCode

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ErrorMessageResponse(
    val code: String?,
    val message: String?,
    val fields: Map<String, List<String>>?
) {
    companion object {
        fun of(code: String, message: String?): ErrorMessageResponse {
            return ErrorMessageResponse(code, message, null)
        }

        fun of(code: MooveErrorCode, message: String?): ErrorMessageResponse {
            return ErrorMessageResponse(code.name, message, null)
        }

        fun of(code: MooveErrorCode, fields: Map<String, List<String>>): ErrorMessageResponse {
            return ErrorMessageResponse(code.name, null, fields)
        }

    }
}
