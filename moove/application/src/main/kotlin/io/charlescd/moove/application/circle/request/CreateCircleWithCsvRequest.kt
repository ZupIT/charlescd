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

package io.charlescd.moove.application.circle.request

import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import java.io.InputStream
import java.time.LocalDateTime
import java.util.*

data class CreateCircleWithCsvRequest(
    val name: String,
    val authorId: String,
    val keyName: String,
    val content: InputStream
) {
    fun toDomain(author: User, workspaceId: String) = Circle(
        id = UUID.randomUUID().toString(),
        name = this.name,
        reference = UUID.randomUUID().toString(),
        author = author,
        createdAt = LocalDateTime.now(),
        importedAt = LocalDateTime.now(),
        defaultCircle = false,
        matcherType = MatcherTypeEnum.SIMPLE_KV,
        workspaceId = workspaceId
    )
}
