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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.build.FindBuildByIdInteractor
import io.charlescd.moove.application.build.response.BuildResponse
import javax.inject.Inject
import javax.inject.Named

@Named
class FindBuildByIdInteractorImpl @Inject constructor(
    private val buildService: BuildService
) : FindBuildByIdInteractor {

    override fun execute(id: String, workspaceId: String): BuildResponse {
        return BuildResponse.from(buildService.find(id, workspaceId))
    }
}
