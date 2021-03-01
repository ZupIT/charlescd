package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateButlerConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateButlerConfigurationRequest
import io.charlescd.moove.application.configuration.response.ButlerConfigurationResponse
import io.charlescd.moove.domain.repository.ButlerConfigurationRepository
import javax.inject.Named

@Named
class CreateButlerConfigurationInteractorImpl(
    private val butlerConfigurationRepository: ButlerConfigurationRepository,
    private val userService: UserService,
    private val workspaceService: WorkspaceService
): CreateButlerConfigurationInteractor {

    override fun execute(request: CreateButlerConfigurationRequest, workspaceId: String, authorization: String): ButlerConfigurationResponse {
        workspaceService.checkIfWorkspaceExists(workspaceId)

        val author = userService.findByAuthorizationToken(authorization)

        val saved = this.butlerConfigurationRepository.save(request.toButlerConfiguration(workspaceId, author))

        return ButlerConfigurationResponse(saved.id, saved.name)
    }
}
