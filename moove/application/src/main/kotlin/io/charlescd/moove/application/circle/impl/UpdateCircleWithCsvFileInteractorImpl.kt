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

package io.charlescd.moove.application.circle.impl

import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.application.*
import io.charlescd.moove.application.circle.UpdateCircleWithCsvFileInteractor
import io.charlescd.moove.application.circle.request.UpdateCircleWithCsvRequest
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.KeyValueRule
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.service.CircleMatcherService
import java.time.LocalDateTime
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class UpdateCircleWithCsvFileInteractorImpl(
    private val circleService: CircleService,
    private val workspaceService: WorkspaceService,
    private val deploymentService: DeploymentService,
    private val buildService: BuildService,
    private val circleMatcherService: CircleMatcherService,
    private val csvSegmentationService: CsvSegmentationService,
    private val keyValueRuleService: KeyValueRuleService
) : UpdateCircleWithCsvFileInteractor {

    @Transactional
    override fun execute(request: UpdateCircleWithCsvRequest, workspaceId: String): CircleResponse {
        val circle = circleService.find(request.id)
        var updatedCircle: Circle

        if (request.shouldUpdateSegmentation()) {
            csvSegmentationService.validate(request.content!!, request.keyName!!)
            val nodeList = csvSegmentationService.createJsonNodeList(request.content, request.keyName)
            updatedCircle = updateMetadata(circle, request, nodeList)
            createKeValueRules(nodeList, updatedCircle)
            createSegmentationOnCircleMatcher(workspaceId, nodeList, updatedCircle, circle.reference)
        } else {
            updatedCircle = updateMetadata(circle, request)
        }

        return createCircleResponse(request.id, updatedCircle)
    }

    private fun createCircleResponse(
        circleId: String,
        updatedCircle: Circle
    ): CircleResponse {
        val deployment = deploymentService.findLastActive(circleId)
        val build = deployment?.let { buildService.find(it.buildId) }
        return CircleResponse.from(updatedCircle, deployment, build)
    }

    private fun createSegmentationOnCircleMatcher(
        workspaceId: String,
        nodeList: List<JsonNode>,
        circle: Circle,
        previousReference: String
    ) {
        val workspace = workspaceService.find(workspaceId)
        nodeList.chunked(100).map {
            circleMatcherService.updateImport(circle, previousReference, it, workspace.circleMatcherUrl!!)
        }
    }

    private fun updateMetadata(circle: Circle, request: UpdateCircleWithCsvRequest, jsonNodes: List<JsonNode>): Circle {
        return circleService.update(
            circle.copy(
                name = request.name,
                matcherType = MatcherTypeEnum.SIMPLE_KV,
                importedAt = LocalDateTime.now(),
                importedKvRecords = jsonNodes.size,
                rules = csvSegmentationService.createPreview(jsonNodes),
                reference = UUID.randomUUID().toString()
            )
        )
    }

    private fun updateMetadata(circle: Circle, request: UpdateCircleWithCsvRequest): Circle {
        return circleService.update(
            circle.copy(
                name = request.name,
                reference = UUID.randomUUID().toString()
            )
        )
    }

    private fun createKeValueRules(
        nodeList: List<JsonNode>,
        circle: Circle
    ) {
        val kvRules = nodeList.map { KeyValueRule(UUID.randomUUID().toString(), it, circle.id) }
        keyValueRuleService.save(kvRules)
    }
}
