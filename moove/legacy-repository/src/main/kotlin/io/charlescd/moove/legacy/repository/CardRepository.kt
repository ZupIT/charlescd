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

package io.charlescd.moove.legacy.repository

import io.charlescd.moove.legacy.repository.entity.Card
import java.util.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface CardRepository : JpaRepository<Card, String> {

    fun findByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Card>

    fun findAllByWorkspaceId(workspaceId: String, pageable: Pageable): Page<Card>

    @Modifying
    @Query(
        value = "delete from cards_labels where card_id = :cardId",
        nativeQuery = true
    )
    fun deleteLabelsRelationship(cardId: String)

    @Modifying
    @Query(
        value = "delete from cards_users where card_id = :cardId",
        nativeQuery = true
    )
    fun deleteMembersRelationship(cardId: String)
}
