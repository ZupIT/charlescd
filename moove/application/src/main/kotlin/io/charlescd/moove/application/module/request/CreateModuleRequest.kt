/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application.module.request

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.*

data class CreateModuleRequest(
    @field:NotBlank
    @field:Size(max = 64)
    val name: String,

    @field:NotBlank
    @field:Size(max = 2048)
    @field:Pattern(regexp = "[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)" +
            "(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))" +
            "(?::\\d{2,5})?(?:\\/[^\\s]*)?", message = "URL inválida.")
    val gitRepositoryAddress: String,

    @field:NotBlank
    @field:Size(max = 2048)
    val helmRepository: String,

    @field:Valid
    @field:NotEmpty
    val components: List<ComponentRequest>
) {
    fun toDomain(moduleId: String, workspaceId: String, author: User) = Module(
        id = moduleId,
        name = this.name.trim(),
        gitRepositoryAddress = this.gitRepositoryAddress,
        createdAt = LocalDateTime.now(),
        helmRepository = this.helmRepository.trim(),
        author = author,
        components = this.components.map { it.toDomain(moduleId, workspaceId) },
        workspaceId = workspaceId
    )
}

data class ComponentRequest(
    @field:NotBlank
    @field:Size(max = 64)
    val name: String,

    @field:NotNull
    val errorThreshold: Int,

    @field:NotNull
    @field:Min(value = 0)
    val latencyThreshold: Int,

    @field:Size(max = 2048)
    val hostValue: String?,

    @field:Size(max = 100)
    val gatewayName: String?
) {
    fun toDomain(moduleId: String, workspaceId: String) = Component(
        id = UUID.randomUUID().toString(),
        name = this.name.trim(),
        moduleId = moduleId,
        createdAt = LocalDateTime.now(),
        workspaceId = workspaceId,
        errorThreshold = this.errorThreshold,
        latencyThreshold = this.latencyThreshold,
        hostValue = this.hostValue?.trim(),
        gatewayName = this.gatewayName?.trim()
    )
}
