/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.databind.JsonNode
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "circles")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType::class)
data class Circle(

    @field:Id
    val id: String,

    val name: String,

    val reference: String?,

    @field:[ManyToOne JoinColumn(name = "user_id")]
    val author: User?,

    val createdAt: LocalDateTime,

    @Enumerated(EnumType.STRING)
    val matcherType: MatcherType,

    @field:[Type(type = "jsonb") Column(columnDefinition = "jsonb")]
    val rules: JsonNode? = null,

    val importedKvRecords: Int? = null,

    val importedAt: LocalDateTime? = null

)

