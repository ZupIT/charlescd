/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.utils

import br.com.zup.darwin.circle.matcher.api.request.CreateSegmentationRequest
import br.com.zup.darwin.circle.matcher.api.request.UpdateSegmentationRequest
import br.com.zup.darwin.circle.matcher.domain.*

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
                type)
    }

    static createSegmentationRequest(Node node, SegmentationType type) {
        def createSegmentationRequest = new CreateSegmentationRequest()
        createSegmentationRequest.name = "Men"
        createSegmentationRequest.node = node
        createSegmentationRequest.reference = "74b21efa-d52f-4266-9e6f-a28f26f7fffd"
        createSegmentationRequest.circleId = "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        createSegmentationRequest.type = type
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
        return request
    }

}
