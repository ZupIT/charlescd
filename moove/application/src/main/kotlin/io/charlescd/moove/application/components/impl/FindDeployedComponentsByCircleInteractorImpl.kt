package io.charlescd.moove.application.components.impl

import io.charlescd.moove.application.components.FindDeployedComponentsByCircleInteractor
import io.charlescd.moove.application.module.response.SimpleComponentResponse
import io.charlescd.moove.domain.SimpleComponent
import io.charlescd.moove.domain.repository.ComponentRepository
import javax.inject.Named

@Named
class FindDeployedComponentsByCircleInteractorImpl(private val componentRepository: ComponentRepository) : FindDeployedComponentsByCircleInteractor {

    override fun execute(workspaceId: String, circleId: String): List<SimpleComponentResponse> {
        return convert(componentRepository.findAllDeployedAtCircle(circleId, workspaceId))
    }

    private fun convert(listComponent: List<SimpleComponent>): List<SimpleComponentResponse> {
        return listComponent.map { SimpleComponentResponse.from(it) }
    }
}
