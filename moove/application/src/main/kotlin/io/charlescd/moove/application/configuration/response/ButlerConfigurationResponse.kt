package io.charlescd.moove.application.configuration.response

import io.charlescd.moove.domain.ButlerConfiguration

data class ButlerConfigurationResponse(
    val id: String,
    val name: String
) {
    companion object {
        fun from(butlerConfiguration: ButlerConfiguration) = ButlerConfigurationResponse(
            id = butlerConfiguration.id,
            name = butlerConfiguration.name
        )
    }
}
