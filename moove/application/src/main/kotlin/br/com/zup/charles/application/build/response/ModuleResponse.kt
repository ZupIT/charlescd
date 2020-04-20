/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.response

import br.com.zup.charles.domain.ModuleSnapshot
import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class ModuleResponse(
    val id: String,
    val name: String,
    val gitRepositoryAddress: String,
    val helmRepository: String,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime,
    val components: List<ComponentResponse>
) {

    companion object {

        fun from(module: ModuleSnapshot): ModuleResponse {
            return ModuleResponse(
                id = module.id,
                name = module.name,
                gitRepositoryAddress = module.gitRepositoryAddress,
                helmRepository = module.helmRepository,
                createdAt = module.createdAt,
                components = module.components.map { ComponentResponse.from(it) }
            )
        }

    }

}