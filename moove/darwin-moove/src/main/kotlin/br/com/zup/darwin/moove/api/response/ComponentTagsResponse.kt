/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.response

data class ComponentTagsResponse(
    val tags: List<TagResponse>
) {

    data class TagResponse(
        val name: String,
        val artifact: String
    )

}