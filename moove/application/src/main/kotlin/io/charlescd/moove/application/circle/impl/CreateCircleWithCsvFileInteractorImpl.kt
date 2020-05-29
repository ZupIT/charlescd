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
import io.charlescd.moove.application.circle.CreateCircleWithCsvFileInteractor
import io.charlescd.moove.application.circle.request.CreateCircleWithCsvRequest
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.KeyValueRule
import io.charlescd.moove.domain.service.CircleMatcherService
import java.util.*
import javax.inject.Named
import javax.transaction.Transactional

@Named
open class CreateCircleWithCsvFileInteractorImpl(
    private val userService: UserService,
    private val circleService: CircleService,
    private val circleMatcherService: CircleMatcherService,
    private val keyValueRuleService: KeyValueRuleService,
    private val csvSegmentationService: CsvSegmentationService,
    private val workspaceService: WorkspaceService
) : CreateCircleWithCsvFileInteractor {

    @Transactional
    override fun execute(request: CreateCircleWithCsvRequest, workspaceId: String): CircleResponse {
        csvSegmentationService.validate(request.content, request.keyName)
        val circle = createCircle(request, workspaceId)
        val nodeList = csvSegmentationService.createJsonNodeList(request.content, request.keyName)
        val updatedCircle = updateMetadata(circle, nodeList)
        createKeyValueRules(nodeList, updatedCircle)

        createSegmentationOnCircleMatcher(workspaceId, nodeList, updatedCircle)

        return CircleResponse.from(updatedCircle)
    }

    private fun createKeyValueRules(
        nodeList: List<JsonNode>,
        circle: Circle
    ) {
        val kvRules = nodeList.map { KeyValueRule(UUID.randomUUID().toString(), it, circle.id) }
        keyValueRuleService.save(kvRules)
    }

    private fun createSegmentationOnCircleMatcher(
        workspaceId: String,
        nodeList: List<JsonNode>,
        circle: Circle
    ) {
        val workspace = workspaceService.find(workspaceId)
        nodeList.chunked(100).map {
            circleMatcherService.createImport(circle, it, workspace.circleMatcherUrl!!)
        }
    }

    private fun createCircle(
        request: CreateCircleWithCsvRequest,
        workspaceId: String
    ): Circle {
        val user = userService.find(request.authorId)
        return circleService.save(request.toDomain(user, workspaceId))
    }

    private fun updateMetadata(circle: Circle, jsonNodes: List<JsonNode>): Circle {
        return circleService.update(
            circle.copy(importedKvRecords = jsonNodes.size, rules = csvSegmentationService.createPreview(jsonNodes))
        )
    }
}

