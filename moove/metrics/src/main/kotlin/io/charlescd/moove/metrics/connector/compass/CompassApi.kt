/*
 *
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
 */

package io.charlescd.moove.metrics.connector.compass

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.ResponseStatus
import java.net.URI

@FeignClient(name = "compassApi", url = "\${compass.url}")
interface CompassApi {

    companion object {
        const val DATASOURCES_ENDPOINT = "/api/v1/datasources"
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = [DATASOURCES_ENDPOINT],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun createMetricGroup(
        @RequestHeader("x-workspace-id") workspaceId: String,
        compassCreateDatasourceRequest: CompassCreateDatasourceRequest
    ): CompassDatasourceResponse

}
