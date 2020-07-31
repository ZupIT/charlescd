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

package io.charlescd.moove.metrics.api

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.metrics.api.response.ProviderConnectionRepresentation
import io.charlescd.moove.metrics.interactor.VerifyProviderConnectionInteractor
import spock.lang.Specification

class MetricsConfigurationControllerUnitTest extends Specification {

    def verifyProviderConnectionInteractor = Mock(VerifyProviderConnectionInteractor)
    def configController = new MetricsConfigurationController(verifyProviderConnectionInteractor)

    def 'should verify provider connection'() {
        given:
        def url = "http://prometheus:9090"
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS

        def connectionRepresentation = new ProviderConnectionRepresentation("SUCCESS")

        when:
        def response = configController.verifyProviderConnection(url, providerType)

        then:
        1 * verifyProviderConnectionInteractor.execute(url, providerType) >> connectionRepresentation
        0 * _

        response != null
        response.status == "SUCCESS"
    }
}
