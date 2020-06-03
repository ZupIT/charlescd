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

package io.charlescd.moove.legacy.moove.api

import io.charlescd.moove.legacy.moove.api.request.NodeRequest
import javax.validation.Valid
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@FeignClient(value = "charlesMatcherApi", url = "\${charlescd.matcher.url}", path = "\${charlescd.matcher.path}")
interface CharlesMatcherApi {

    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    @PostMapping(
        produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun create(@RequestBody @Valid nodeRequest: NodeRequest)

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping(
        "/{reference}", produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )

    fun delete(@PathVariable("reference") reference: String)

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(
        "/{reference}",
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun update(@PathVariable("reference") reference: String, @RequestBody @Valid nodeRequest: NodeRequest)

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(
        "/import",
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun importUpdate(@RequestBody @Valid request: List<NodeRequest>)

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        "/import",
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun importCreate(@RequestBody @Valid request: List<NodeRequest>)
}
