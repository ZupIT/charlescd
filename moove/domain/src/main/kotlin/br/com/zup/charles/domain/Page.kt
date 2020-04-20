/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.domain

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