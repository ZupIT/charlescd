/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.extension

import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import org.springframework.data.domain.Page

fun <T> Page<T>.toResourcePageRepresentation() =
    ResourcePageRepresentation(
        content = this.content,
        page = this.number,
        size = this.size,
        isLast = this.isLast,
        totalPages = this.totalPages
    )