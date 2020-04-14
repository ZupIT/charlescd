/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api

import br.com.zup.darwin.moove.api.request.NodeRequest
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@FeignClient(value = "darwinMatcherApi", url = "\${darwin.matcher.url}", path = "\${darwin.matcher.path}")
interface DarwinMatcherApi {

    @ResponseStatus(HttpStatus.CREATED)
    @ResponseBody
    @PostMapping(
        produces = [(MediaType.APPLICATION_JSON_UTF8_VALUE)],
        consumes = [(MediaType.APPLICATION_JSON_UTF8_VALUE)]
    )
    fun create(@RequestBody @Valid nodeRequest: NodeRequest)

    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{reference}")
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
