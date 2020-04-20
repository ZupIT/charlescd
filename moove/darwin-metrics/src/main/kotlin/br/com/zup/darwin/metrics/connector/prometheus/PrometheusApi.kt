/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.metrics.connector.prometheus

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import javax.validation.Valid

@FeignClient(name = "prometheusApi", url = "\${prometheus.url}")
interface PrometheusApi {

    companion object {
        const val QUERY_ENDPOINT = "/api/v1/query"
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
            value = [QUERY_ENDPOINT],
            produces = [MediaType.APPLICATION_JSON_VALUE],
            consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun executeQuery(@Valid @RequestParam("query") query: String): PrometheusMetricResponse
}