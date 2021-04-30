package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.configuration.DeleteDeploymentConfigurationByIdInteractor
import javax.inject.Inject
import javax.inject.Named

@Named
class DeleteDeploymentConfigurationByIdInteractorImpl @Inject constructor(
    val deploymentConfigurationService: DeploymentConfigurationService
) : DeleteDeploymentConfigurationByIdInteractor {

    override fun execute(workspaceId: String, id: String) {
        deploymentConfigurationService.checkIfDeploymentConfigurationExists(workspaceId, id)
        deploymentConfigurationService.delete(id)
    }
}
