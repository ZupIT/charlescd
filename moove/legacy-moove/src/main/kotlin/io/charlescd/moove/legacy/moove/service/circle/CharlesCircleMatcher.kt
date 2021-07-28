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

package io.charlescd.moove.legacy.moove.service.circle

import io.charlescd.moove.legacy.moove.api.CharlesMatcherApi
import io.charlescd.moove.legacy.moove.api.request.NodeRequest
import org.springframework.stereotype.Service

@Service
class CharlesCircleMatcher(private val charlesMatcherApi: CharlesMatcherApi) : CircleMatcher {

    override fun create(
        name: String,
        node: NodeRequest.Node,
        reference: String,
        circleId: String,
        type: String
    ) =
        charlesMatcherApi.create(
            NodeRequest(
                name = name,
                node = node,
                reference = reference,
                circleId = circleId,
                type = type
            )
        )

    override fun update(
        name: String,
        node: NodeRequest.Node,
        previousReference: String,
        reference: String,
        circleId: String,
        type: String
    ) {
        charlesMatcherApi.update(
            previousReference,
            NodeRequest(
                name = name,
                node = node,
                reference = reference,
                previousReference = previousReference,
                circleId = circleId,
                type = type
            )
        )
    }

    override fun importUpdate(request: List<NodeRequest>) {
        charlesMatcherApi.importUpdate(request)
    }

    override fun importCreate(request: List<NodeRequest>) {
        charlesMatcherApi.importCreate(request)
    }

    override fun delete(reference: String) {
        charlesMatcherApi.delete(reference)
    }
}
