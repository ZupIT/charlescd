/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.FindBuildByIdInteractor
import br.com.zup.charles.application.build.response.BuildResponse
import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import javax.inject.Inject
import javax.inject.Named

@Named
class FindBuildByIdInteractorImpl @Inject constructor(
    private val buildRepository: BuildRepository
) : FindBuildByIdInteractor {

    override fun execute(id: String, applicationId: String): BuildResponse {
        return BuildResponse.from(findBuild(id, applicationId))
    }

    private fun findBuild(id: String, applicationId: String): Build {
        return this.buildRepository.find(
            id,
            applicationId
        ).orElseThrow {
            NotFoundException(ResourceValue("build", id))
        }
    }
}