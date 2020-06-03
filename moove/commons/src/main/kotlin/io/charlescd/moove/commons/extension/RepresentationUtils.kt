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

package io.charlescd.moove.commons.extension

import io.charlescd.moove.commons.representation.ResourcePageRepresentation
import org.springframework.data.domain.Page

fun <T> Page<T>.toResourcePageRepresentation() =
    ResourcePageRepresentation(
        content = this.content,
        page = this.number,
        size = this.size,
        isLast = this.isLast,
        totalPages = this.totalPages
    )
