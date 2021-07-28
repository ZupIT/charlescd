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

package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.*
import java.util.*

interface BuildRepository {

    fun save(build: Build): Build

    fun updateStatus(id: String, status: BuildStatusEnum)

    fun findById(id: String): Optional<Build>

    fun find(id: String, workspaceId: String): Optional<Build>

    fun find(tag: String?, status: BuildStatusEnum?, workspaceId: String, page: PageRequest): Page<Build>

    fun delete(build: Build)

    fun saveArtifacts(artifacts: List<ArtifactSnapshot>)
}
