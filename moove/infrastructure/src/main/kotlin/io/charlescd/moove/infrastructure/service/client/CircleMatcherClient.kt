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

package io.charlescd.moove.infrastructure.service.client

import java.net.URI
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@FeignClient(name = "circleMatcherClient", url = "\${charlescd.matcher.url}")
interface CircleMatcherClient {

    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        path = ["/segmentation"],
        produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun create(uri: URI, @RequestBody request: CircleMatcherRequest)

    @ResponseStatus(HttpStatus.OK)
    @PutMapping(
        path = ["/segmentation/{reference}"],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun update(
        uri: URI,
        @PathVariable(name = "reference") reference: String,
        @RequestBody request: CircleMatcherRequest
    )

    @ResponseBody
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        path = ["/segmentation/import"],
        produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun createImport(uri: URI, @RequestBody request: List<CircleMatcherRequest>)

    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        path = ["/segmentation/import"],
        produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun updateImport(uri: URI, @RequestBody request: List<CircleMatcherRequest>)

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(
        path = ["/segmentation/{reference}"],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun delete(uri: URI, @PathVariable(name = "reference") reference: String)

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        path = ["/identify"],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun identify(uri: URI, @RequestBody request: IdentifyRequest): IdentifyResponse
}
