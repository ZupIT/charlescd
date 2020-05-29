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

package io.charlescd.moove.api.controller

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.role.FindAllRolesInteractor
import io.charlescd.moove.application.role.response.RoleResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@Api(value = "Role Endpoints", tags = ["Role"])
@RestController
@RequestMapping("/v2/roles")
class V2RoleController(private val findAllRolesInteractor: FindAllRolesInteractor) {

    @ApiOperation(value = "Find all Roles")
    @GetMapping
    fun findAll(pageable: PageRequest): ResourcePageResponse<RoleResponse> {
        return this.findAllRolesInteractor.execute(pageable)
    }

}
