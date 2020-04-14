/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service.circle

import br.com.zup.darwin.moove.api.request.NodeRequest

interface CircleMatcher {
    fun create(
        name: String,
        node: NodeRequest.Node,
        reference: String,
        circleId: String,
        type: String
    )

    fun update(
        name: String,
        node: NodeRequest.Node,
        previousReference: String,
        reference: String,
        circleId: String,
        type: String
    )

    fun importUpdate(
        request: List<NodeRequest>
    )

    fun importCreate(
        request: List<NodeRequest>
    )

    fun delete(reference: String)
}
