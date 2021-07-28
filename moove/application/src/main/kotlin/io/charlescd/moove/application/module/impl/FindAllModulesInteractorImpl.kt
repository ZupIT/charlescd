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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.ResourcePageResponse
import io.charlescd.moove.application.module.FindAllModulesInteractor
import io.charlescd.moove.application.module.response.ModuleResponse
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import javax.inject.Named

@Named
class FindAllModulesInteractorImpl(private val moduleService: ModuleService) : FindAllModulesInteractor {

    override fun execute(
        workspaceId: String,
        name: String?,
        pageRequest: PageRequest
    ): ResourcePageResponse<ModuleResponse> {
        return convert(moduleService.findByWorkspaceId(workspaceId, name, pageRequest))
    }

    private fun convert(page: Page<Module>): ResourcePageResponse<ModuleResponse> {
        return ResourcePageResponse(
            content = page.content.map { ModuleResponse.from(it) },
            page = page.pageNumber,
            size = page.size(),
            isLast = page.isLast(),
            totalPages = page.totalPages()
        )
    }
}
