/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.circle

import br.com.zup.darwin.moove.api.request.NodeRequest
import javax.validation.constraints.NotBlank

class UpdateCircleRequest(

    @field:NotBlank
    val name: String,

    val rules: NodeRequest.Node
)