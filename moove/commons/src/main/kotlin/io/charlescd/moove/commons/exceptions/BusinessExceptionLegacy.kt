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

package io.charlescd.moove.commons.exceptions

import io.charlescd.moove.commons.constants.MooveErrorCodeLegacy

class BusinessExceptionLegacy : RuntimeException {

    private val errorCode: MooveErrorCodeLegacy

    private var parameters: Array<String>? = null

    private constructor(errorCode: MooveErrorCodeLegacy, parameters: Array<String>?) : super() {
        this.errorCode = errorCode
        this.parameters = parameters
    }

    private constructor (errorCode: MooveErrorCodeLegacy, cause: Throwable) : super(cause) {
        this.errorCode = errorCode
    }

    private constructor (errorCode: MooveErrorCodeLegacy, message: String) : super(message) {
        this.errorCode = errorCode
    }

    companion object {

        fun of(errorCode: MooveErrorCodeLegacy): BusinessExceptionLegacy {
            return BusinessExceptionLegacy(errorCode, errorCode.key)
        }

        fun of(errorCode: MooveErrorCodeLegacy, message: String): BusinessExceptionLegacy {
            return BusinessExceptionLegacy(errorCode, message)
        }
    }

    fun withParameters(vararg params: String): BusinessExceptionLegacy {
        return apply { parameters = params as Array<String>? }
    }

    fun getErrorCode(): MooveErrorCodeLegacy {
        return this.errorCode
    }

    fun getParameters(): Array<String>? {
        return this.parameters
    }
}
