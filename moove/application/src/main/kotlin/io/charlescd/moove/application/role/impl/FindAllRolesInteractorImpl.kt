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

package io.charlescd.moove.application.role.impl

import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.RoleService
import io.charlescd.moove.application.role.FindAllRolesInteractor
import io.charlescd.moove.application.role.response.RoleResponse
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.Role
import javax.inject.Inject
import javax.inject.Named

@Named
class FindAllRolesInteractorImpl @Inject constructor(
    private val roleService: RoleService
) : FindAllRolesInteractor {

    override fun execute(pageRequest: PageRequest): ResourcePageResponse<RoleResponse> {
        return convert(this.roleService.find(pageRequest))
    }

    private fun convert(page: Page<Role>): ResourcePageResponse<RoleResponse> {
        return ResourcePageResponse(
            content = page.content.map { RoleResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
