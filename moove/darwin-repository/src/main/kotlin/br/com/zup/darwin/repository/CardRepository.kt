/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.repository

import br.com.zup.darwin.entity.Card
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.util.*

interface CardRepository : JpaRepository<Card, String> {

    fun findByIdAndApplicationId(id: String, applicationId: String): Optional<Card>

    fun findAllByApplicationId(applicationId: String, pageable: Pageable): Page<Card>

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