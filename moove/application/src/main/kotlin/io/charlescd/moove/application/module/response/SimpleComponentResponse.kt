package io.charlescd.moove.application.module.response

import io.charlescd.moove.domain.SimpleComponent

data class SimpleComponentResponse(
    val id: String,
    val name: String,
    val errorThreshold: Int? = null,
    val latencyThreshold: Int? = null,
    val moduleId: String,
    val moduleName: String
) {
    companion object {
        fun from(simpleComponent: SimpleComponent): SimpleComponentResponse {
            return SimpleComponentResponse(
                id = simpleComponent.id,
                name = simpleComponent.name,
                errorThreshold = simpleComponent.errorThreshold,
                latencyThreshold = simpleComponent.latencyThreshold,
                moduleId = simpleComponent.moduleId,
                moduleName = simpleComponent.moduleName
            )
        }
    }
}
