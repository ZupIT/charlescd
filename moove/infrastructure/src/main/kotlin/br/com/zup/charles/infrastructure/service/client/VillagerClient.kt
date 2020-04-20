/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service.client

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.ResponseStatus

@FeignClient(name = "villagerClient", url = "\${darwin.villager.url}")
interface VillagerClient {

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = ["/build"],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun build(
        @RequestHeader("x-application-id") applicationId: String,
        @RequestBody request: VillagerBuildRequest
    ): VillagerBuildResponse
}