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

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.configuration.ProviderConnectionStatusConfigurationInteractor
import io.charlescd.moove.application.metric.response.ProviderConnectionResponse
import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import org.springframework.stereotype.Service

@Service
class ProviderConnectionStatusInteractorImpl(
    private val serviceFactory: MetricServiceFactory
) : ProviderConnectionStatusConfigurationInteractor {

    override fun execute(provider: String, providerType: MetricConfiguration.ProviderEnum): ProviderConnectionResponse {
        return ProviderConnectionResponse(
            this.serviceFactory.getConnector(providerType).readinessCheck(provider).status
        )
    }
}
