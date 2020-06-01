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

package io.charlescd.circlematcher.utils

import io.charlescd.circlematcher.api.request.CreateSegmentationRequest
import io.charlescd.circlematcher.api.request.UpdateSegmentationRequest
import io.charlescd.circlematcher.domain.*

class TestUtils {

    static Node createNode(Content content) {
        new Node(NodeType.RULE, LogicalOperatorType.OR, null, content)
    }

    static Content createContent(ArrayList values) {
        new Content("username", "EQUAL", values)
    }

    static Segmentation createSegmentation(Node node, SegmentationType type) {
        new Segmentation("Men",
                node,
                "28840781-d86e-4803-a742-53566c140e56",
                "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85",
                type,
                "78094351-7f16-4571-ac7a-7681db81e146",
                false)
    }

    static Segmentation createDefaultSegmentation(Node node, SegmentationType type) {
        new Segmentation("Default",
                node,
                "28840781-d86e-4803-a742-53566c140e59",
                "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a89",
                type,
                "78094351-7f16-4571-ac7a-7681db81e146",
                true)
    }

    static createSegmentationRequest(Node node, SegmentationType type) {
        def createSegmentationRequest = new CreateSegmentationRequest()
        createSegmentationRequest.name = "Men"
        createSegmentationRequest.node = node
        createSegmentationRequest.reference = "74b21efa-d52f-4266-9e6f-a28f26f7fffd"
        createSegmentationRequest.circleId = "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        createSegmentationRequest.type = type
        createSegmentationRequest.isDefault = false
        return createSegmentationRequest
    }

    static createUpdateSegmentationRequest(Node node, SegmentationType type) {
        def request = new UpdateSegmentationRequest()
        request.previousReference = "74b21efa-d52f-4266-9e6f-a28f26f7fffd"
        request.reference = "5ae8a1c4-2acb-4eda-9e37-e6e74bc5eebe"
        request.circleId = "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        request.name = "Women"
        request.node = node
        request.type = type
        request.isDefault = false
        return request
    }
}
