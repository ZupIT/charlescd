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

package io.charlescd.moove.security.infrastructure

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.type.TypeFactory
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule

object JacksonExtension {

    val jacksonObjectMapper: ObjectMapper by lazy {
        ObjectMapper().registerModule(JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .registerModule(KotlinModule())
    }

}

fun <T> String.jsonToArrayListObject(t: Class<T>): ArrayList<T> {
    val valueType = TypeFactory.defaultInstance().constructCollectionType(ArrayList::class.java, t)
    return JacksonExtension.jacksonObjectMapper.readValue(this, valueType)
}

fun <T> String.jsonToMutableListObject(t: Class<T>): MutableList<T> {
    val valueType = TypeFactory.defaultInstance().constructCollectionType(MutableList::class.java, t)
    return JacksonExtension.jacksonObjectMapper.readValue(this, valueType)
}

fun <T> String.jsonToObject(t: Class<T>): T =
    JacksonExtension.jacksonObjectMapper.readValue(this, t)

fun <T> T.objectToJson(): String =
    JacksonExtension.jacksonObjectMapper.writeValueAsString(this)

fun <T> T.toJsonNode(): JsonNode =
    JacksonExtension.jacksonObjectMapper.convertValue(this, JsonNode::class.java)

fun <T, K> String.jsonToMap(t: Class<T>, k: Class<K>): Map<T?, K?> {
    val valueType = TypeFactory.defaultInstance().constructMapType(Map::class.java, t, k)
    return JacksonExtension.jacksonObjectMapper.readValue(this, valueType)
}
