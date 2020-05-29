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

package io.charlescd.moove.application

import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import java.util.*
import javax.inject.Named

@Named
class CircleService(private val circleRepository: CircleRepository) {

    fun save(circle: Circle): Circle {
        return this.circleRepository.save(circle)
    }

    fun update(circle: Circle): Circle {
        return this.circleRepository.update(circle)
    }

    fun delete(id: String) {
        this.circleRepository.delete(id)
    }

    fun find(circleId: String): Circle {
        return this.circleRepository.findById(
            circleId
        ).orElseThrow {
            NotFoundException("circle", circleId)
        }
    }

    fun find(circleId: String, workspaceId: String): Circle {
        return this.circleRepository.find(
            circleId,
            workspaceId
        ).orElseThrow {
            NotFoundException("circle", circleId)
        }
    }

    fun find(name: String?, active: Boolean, workspaceId: String, pageRequest: PageRequest): Page<Circle> {
        return this.circleRepository.find(
            name,
            active,
            workspaceId,
            pageRequest
        )
    }

    fun findDefaultByWorkspaceId(workspaceId: String): Optional<Circle> {
        return this.circleRepository.findDefaultByWorkspaceId(workspaceId)
    }
}
