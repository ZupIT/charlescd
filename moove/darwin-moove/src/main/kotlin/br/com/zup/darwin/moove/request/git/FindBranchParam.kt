/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.git

import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class FindBranchParam(

    @field:NotNull
    val moduleIds: List<String>,

    @field:NotBlank
    val branchName: String
)
