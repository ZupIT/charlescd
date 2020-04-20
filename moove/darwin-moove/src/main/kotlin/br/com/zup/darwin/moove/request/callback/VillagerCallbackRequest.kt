/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.callback

data class VillagerCallbackRequest(
    val status: VillagerBuildStatus,
    val modules: List<VillagerImageRequest>?
) {

    data class VillagerImageRequest(
        val moduleId: String,
        val status: VillagerBuildStatus,
        val components: List<VillagerComponentRequest>
    )

    data class VillagerComponentRequest(
        val name: String,
        val tagName: String
    )

    enum class VillagerBuildStatus {
        SUCCESS, TIME_OUT
    }

}