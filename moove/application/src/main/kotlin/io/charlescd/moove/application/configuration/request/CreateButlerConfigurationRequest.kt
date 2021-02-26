package io.charlescd.moove.application.configuration.request

import io.charlescd.moove.domain.ButlerConfiguration
import io.charlescd.moove.domain.User
import java.util.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

data class CreateButlerConfigurationRequest(
    val name: String = "Butler Configuration",

    @field:NotBlank
    @field:NotNull
    val butlerUrl: String,

    @field:NotBlank
    @field:NotNull
    val namespace: String,

    @field:NotBlank
    @field:NotNull
    val gitToken: String
) {

    fun toButlerConfiguration(workspaceId: String, author: User) = ButlerConfiguration(
        id = UUID.randomUUID().toString(),
        name = name,
        author = author,
        workspaceId = workspaceId,
        butlerUrl = butlerUrl,
        namespace = namespace,
        gitToken = gitToken
    )
}
