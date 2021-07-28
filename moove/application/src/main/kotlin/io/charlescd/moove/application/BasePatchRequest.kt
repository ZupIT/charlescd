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

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.github.fge.jsonpatch.JsonPatch
import io.charlescd.moove.commons.extension.toJsonNode
import javax.validation.constraints.NotNull

abstract class BasePatchRequest<T : Any>(open val patches: List<PatchOperation>) {

    abstract fun validate()

    inline fun <reified T : Any> applyPatch(entity: T): T {
        val mapper = ObjectMapper().registerModule(KotlinModule()).registerModule(JavaTimeModule())
        val patch = JsonPatch.fromJson(this.patches.toJsonNode())
        val patched: JsonNode = patch.apply(mapper.convertValue(entity, JsonNode::class.java))
        return mapper.treeToValue(patched, T::class.java)
    }
}

data class PatchOperation(
    @field:NotNull
    val op: OpCodeEnum,

    @field:NotNull
    val path: String,

    val value: Any?
)

enum class OpCodeEnum {
    @field:JsonProperty("add")
    ADD,

    @field:JsonProperty("remove")
    REMOVE,

    @field:JsonProperty("replace")
    REPLACE
}
