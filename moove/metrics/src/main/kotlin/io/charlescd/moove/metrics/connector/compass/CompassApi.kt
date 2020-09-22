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
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus

@FeignClient(name = "compassApi", url = "\${charlescd.compass.url}")
interface CompassApi {

    companion object {
        const val DATASOURCES_ENDPOINT = "/api/v1/datasources"
        const val DELETE_DATASOURCES_ENDPOINT = "/api/v1/datasources/{datasourceId}"
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(
        value = [DATASOURCES_ENDPOINT],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun saveHealthyDatasource(
        @RequestHeader("x-workspace-id") workspaceId: String,
        compassCreateDatasourceRequest: CompassCreateDatasourceRequest
    ): CompassDatasourceResponse

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        value = [DATASOURCES_ENDPOINT],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun findDatasource(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestParam("healthy") healthy: Boolean
    ): List<CompassDatasourceResponse>

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping(
        value = [DELETE_DATASOURCES_ENDPOINT],
        produces = [MediaType.APPLICATION_JSON_VALUE],
        consumes = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun deleteDatasource(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @PathVariable datasourceId: String
    ): CompassDatasourceResponse
}
