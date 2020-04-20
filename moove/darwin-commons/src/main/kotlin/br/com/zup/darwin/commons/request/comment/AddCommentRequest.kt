/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.request.comment

import javax.validation.constraints.NotBlank

data class AddCommentRequest(
    @field:NotBlank
    val authorId: String,

    @field:NotBlank
    val comment: String
)