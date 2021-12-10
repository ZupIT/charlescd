/*
 *
 *  * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import java.util.*
import javax.inject.Named

@Named
class CircleService(private val circleRepository: CircleRepository) {

    fun save(circle: Circle): Circle {
        if (this.circleRepository.existsByNameAndWorkspaceId(circle.name, circle.workspaceId)) {
            throw BusinessException.of(MooveErrorCode.DUPLICATED_CIRCLE_NAME_ERROR)
        }
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

    fun findByIdAndWorkspaceId(circleId: String, workspaceId: String): Circle {
        return this.circleRepository.findByIdAndWorkspaceId(
            circleId,
            workspaceId
        ).orElseThrow {
            NotFoundException("circle", circleId)
        }
    }

    fun find(name: String?, active: Boolean?, workspaceId: String, pageRequest: PageRequest): Page<Circle> {
        return this.circleRepository.find(
            name,
            active,
            workspaceId,
            pageRequest
        )
    }

    fun find(name: String?, except: String?, status: Boolean?, workspaceId: String, pageRequest: PageRequest): Page<SimpleCircle> {
        return this.circleRepository.find(
            name,
            except,
            status,
            workspaceId,
            pageRequest
        )
    }

    fun findDefaultByWorkspaceId(workspaceId: String): Optional<Circle> {
        return this.circleRepository.findDefaultByWorkspaceId(workspaceId)
    }

    fun findByWorkspaceId(workspaceId: String): Circles {
        return this.circleRepository.findByWorkspaceId(workspaceId)
    }

    private fun findSumPercentageCirclesValuesInWorkspace(workspaceId: String): Int {
        return this.circleRepository.countPercentageByWorkspaceId(workspaceId)
    }

    fun checkIfLimitOfPercentageReached(percentageRequest: Int, workspaceId: String) {
        verifyLimitReached(this.findSumPercentageCirclesValuesInWorkspace(workspaceId), percentageRequest)
    }

    private fun verifyLimitReached(actualPercentage: Int, percentageRequest: Int) {
        if (actualPercentage + percentageRequest > 100) {
            val percentageRemaining = 100 - actualPercentage
            throw BusinessException.of(MooveErrorCode.LIMIT_OF_PERCENTAGE_CIRCLES_EXCEEDED)
                .withParameters("Percentage remaining: $percentageRemaining")
        }
    }

    fun checkIfPercentageCircleCanDeploy(circle: Circle, workspaceId: String) {
        val percentageCircles = this.circleRepository.findCirclesPercentage(workspaceId, null, active = true, pageRequest = null).content
        val isAlreadyDeployed = percentageCircles.map { it.id }.contains(circle.id)
        val sumPercentage = percentageCircles.takeIf { it.isNotEmpty() }?.map { it -> it.percentage }?.reduce { acc, value -> acc?.plus(value ?: 0) } ?: 0
        if (!isAlreadyDeployed) {
            verifyLimitReached(sumPercentage, circle.percentage!!)
        }
    }
}
