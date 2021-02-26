package io.charlescd.moove.application.configuration

import io.charlescd.moove.application.configuration.request.CreateButlerConfigurationRequest
import io.charlescd.moove.application.configuration.response.ButlerConfigurationResponse

interface CreateButlerConfigurationInteractor {

    fun execute(request: CreateButlerConfigurationRequest, workspaceId: String, authorization: String): ButlerConfigurationResponse
}
