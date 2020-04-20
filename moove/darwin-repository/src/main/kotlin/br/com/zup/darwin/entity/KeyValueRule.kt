/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.databind.JsonNode
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.Type
import org.hibernate.annotations.TypeDef
import javax.persistence.*

@Entity
@Table(name = "key_value_rules")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType::class)
data class KeyValueRule(

    @field:Id
    val id: String,

    @field:[Type(type = "jsonb") Column(columnDefinition = "jsonb")]
    val rule: JsonNode,

    @field:ManyToOne
    @field:JsonManagedReference
    @field:JoinColumn(name = "circle_id")
    val circle: Circle

)