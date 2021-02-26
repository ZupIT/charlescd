package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.ButlerConfiguration

interface ButlerConfigurationRepository {

    fun save(butlerConfiguration: ButlerConfiguration): ButlerConfiguration
}
