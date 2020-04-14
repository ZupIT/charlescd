/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service.circle

import br.com.zup.darwin.moove.api.DarwinMatcherApi
import br.com.zup.darwin.moove.api.request.NodeRequest
import org.springframework.stereotype.Service

@Service
class DarwinCircleMatcher(private val darwinMatcherApi: DarwinMatcherApi) : CircleMatcher {

    override fun create(
        name: String,
        node: NodeRequest.Node,
        reference: String,
        circleId: String,
        type: String
    ) =
        darwinMatcherApi.create(
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
        darwinMatcherApi.update(
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
        darwinMatcherApi.importUpdate(request)
    }

    override fun importCreate(request: List<NodeRequest>) {
        darwinMatcherApi.importCreate(request)
    }


    override fun delete(reference: String) {
        darwinMatcherApi.delete(reference)
    }
}
