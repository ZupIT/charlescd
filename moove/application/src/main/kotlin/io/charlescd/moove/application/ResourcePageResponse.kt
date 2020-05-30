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

data class ResourcePageResponse<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val isLast: Boolean,
    val totalPages: Int
) {
    companion object {
        fun <T> from(
            content: List<T>,
            page: Int,
            size: Int,
            isLast: Boolean,
            totalPages: Int
        ) = ResourcePageResponse<T>(
            content,
            page,
            size,
            isLast,
            totalPages
        )
    }
}
