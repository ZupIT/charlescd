package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.DeploymentConfigurationService
import io.charlescd.moove.application.DeploymentService
import io.charlescd.moove.application.configuration.DeleteDeploymentConfigurationByIdInteractor
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import javax.inject.Inject
import javax.inject.Named

@Named
class DeleteDeploymentConfigurationByIdInteractorImpl @Inject constructor(
    val deploymentConfigurationService: DeploymentConfigurationService,
    val deploymentService: DeploymentService
) : DeleteDeploymentConfigurationByIdInteractor {

    override fun execute(workspaceId: String, id: String) {
        deploymentConfigurationService.checkIfDeploymentConfigurationExists(workspaceId, id)
        verifyIfExistsActiveDeploymentInWorkspace(workspaceId)
        deploymentConfigurationService.delete(id)
    }

    private fun verifyIfExistsActiveDeploymentInWorkspace(workspaceId: String) {
        if (deploymentService.existsActiveListByWorkspace(workspaceId)) {
            throw BusinessException.of(MooveErrorCode.ACTIVE_DEPLOYMENT_NAMESPACE_ERROR)
        }
    }
}
