/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build

import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.application.build.response.ResourcePageResponse
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.PageRequest

interface FindAllBuildsInteractor {

    fun execute(
        tagName: String?,
        status: BuildStatusEnum?,
        applicationId: String,
        pageRequest: PageRequest
    ): ResourcePageResponse<BuildResponse>

}