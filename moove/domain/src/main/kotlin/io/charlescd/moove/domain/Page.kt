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

package io.charlescd.moove.domain

import kotlin.math.ceil

data class Page<T>(
    val content: List<T>,
    val pageNumber: Int,
    val pageSize: Int,
    val total: Int
) {
    fun isLast(): Boolean {
        return this.pageNumber + 1 >= this.totalPages()
    }

    fun totalPages(): Int {
        return if (this.content.isEmpty() && this.total == 0) 1 else ceil(this.total.toDouble() / this.pageSize.toDouble()).toInt()
    }

    fun size(): Int {
        return this.content.size
    }
}
