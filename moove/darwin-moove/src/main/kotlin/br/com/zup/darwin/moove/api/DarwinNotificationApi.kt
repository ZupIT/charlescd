/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api

import br.com.zup.darwin.moove.api.request.CreateNotificationRequest
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseBody

@FeignClient(
    value = "darwinNotificationApi",
    url = "\${darwin.notification.url}",
    path = "\${darwin.notification.path}"
)
interface DarwinNotificationApi {

    @PostMapping(
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    @ResponseBody
    fun create(@RequestBody createNotificationRequest: CreateNotificationRequest)

}