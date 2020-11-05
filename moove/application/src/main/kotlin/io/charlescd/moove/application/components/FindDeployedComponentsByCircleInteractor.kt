package io.charlescd.moove.application.components

import io.charlescd.moove.application.module.response.SimpleComponentResponse

interface FindDeployedComponentsByCircleInteractor {

    fun execute(workspaceId: String, circleId: String): List<SimpleComponentResponse>
}
