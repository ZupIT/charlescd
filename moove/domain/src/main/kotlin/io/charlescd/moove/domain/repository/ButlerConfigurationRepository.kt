package io.charlescd.moove.domain.repository

import io.charlescd.moove.domain.ButlerConfiguration
import java.util.*


interface ButlerConfigurationRepository {

    fun save(butlerConfiguration: ButlerConfiguration): ButlerConfiguration

    fun find(id: String): Optional<ButlerConfiguration>
}
