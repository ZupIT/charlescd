/*
 *
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
 */

package io.charlescd.moove.metrics.interactor.impl

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.metrics.api.response.ProviderConnectionRepresentation
import io.charlescd.moove.metrics.connector.MetricService
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.interactor.VerifyWorkspaceProviderConnectionInteractor
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class VerifyWorkspaceProviderConnectionInteractorImpl(
    private val serviceFactory: MetricServiceFactory,
    private val metricConfigurationRepository: MetricConfigurationRepository
) : VerifyWorkspaceProviderConnectionInteractor {

    private val log = LoggerFactory.getLogger(this.javaClass)

    override fun execute(workspaceId: String, providerId: String, providerType: MetricConfiguration.ProviderEnum): ProviderConnectionRepresentation {
        val service = serviceFactory.getConnector(providerType)

        val metricConfiguration = this.metricConfigurationRepository.find(providerId, workspaceId)
            .orElseThrow { NotFoundException("metric configuration for workspace", workspaceId) }

        val url = metricConfiguration.url

        return kotlin.runCatching { verifyProvider(url, service) }
            .getOrElse { verifyException(it) }
    }

    private fun verifyProvider(url: String, service: MetricService): ProviderConnectionRepresentation {
        service.healthCheck(url)
        service.readinessCheck(url)

        return ProviderConnectionRepresentation(
            status = "SUCCESS"
        )
    }

    private fun verifyException(e: Throwable): ProviderConnectionRepresentation {
        log.error(e.message, e)
        return ProviderConnectionRepresentation(
            status = "FAILED"
        )
    }
}
