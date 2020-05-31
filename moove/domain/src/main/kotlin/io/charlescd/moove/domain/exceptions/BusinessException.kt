/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.domain.exceptions

import io.charlescd.moove.domain.MooveErrorCode

class BusinessException : RuntimeException {

    private val errorCode: MooveErrorCode

    private var parameters: Array<String>? = null

    private constructor(errorCode: MooveErrorCode, parameters: Array<String>?) : super() {
        this.errorCode = errorCode
        this.parameters = parameters
    }

    private constructor (errorCode: MooveErrorCode, cause: Throwable) : super(cause) {
        this.errorCode = errorCode
    }

    private constructor (errorCode: MooveErrorCode, message: String) : super(message) {
        this.errorCode = errorCode
    }

    companion object {

        fun of(errorCode: MooveErrorCode): BusinessException {
            return BusinessException(errorCode, errorCode.key)
        }

        fun of(errorCode: MooveErrorCode, message: String): BusinessException {
            return BusinessException(errorCode, message)
        }

    }

    fun withParameters(vararg params: String): BusinessException {
        return apply { parameters = params as Array<String>? }
    }

    fun getErrorCode(): MooveErrorCode {
        return this.errorCode
    }

    fun getParameters(): Array<String>? {
        return this.parameters
    }
}
