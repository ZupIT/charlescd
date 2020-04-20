/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.request.member

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class AddMemberRequest(

    @field:NotBlank
    val authorId:String,

    @field:NotNull
    val memberIds: List<String>
)