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

package io.charlescd.moove.application

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import javax.inject.Named

@Named
class BuildService(private val buildRepository: BuildRepository) {

    fun find(id: String): Build {
        return this.buildRepository.findById(
            id
        ).orElseThrow {
            NotFoundException("build", id)
        }
    }

    fun find(id: String, workspaceId: String): Build {
        return this.buildRepository.find(
            id,
            workspaceId
        ).orElseThrow {
            NotFoundException("build", id)
        }
    }

    fun find(tag: String?, status: BuildStatusEnum?, workspaceId: String, pageRequest: PageRequest): Page<Build> {
        return this.buildRepository.find(
            tag,
            status,
            workspaceId,
            pageRequest
        )
    }

    fun save(build: Build): Build {
        return this.buildRepository.save(build)
    }

    fun saveArtifacts(artifacts: List<ArtifactSnapshot>) {
        this.buildRepository.saveArtifacts(artifacts)
    }

    fun updateStatus(id: String, status: BuildStatusEnum) {
        this.buildRepository.updateStatus(id, status)
    }

    fun delete(build: Build) {
        return this.buildRepository.delete(build)
    }
}
