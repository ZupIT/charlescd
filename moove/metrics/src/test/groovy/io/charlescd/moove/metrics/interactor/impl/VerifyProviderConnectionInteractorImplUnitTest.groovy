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
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import spock.lang.Specification

class VerifyProviderConnectionInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def providerService = Mock(PrometheusService)
    def verifyProviderConnectionInteractorImpl = new VerifyProviderConnectionInteractorImpl(serviceFactory)


    def 'should return success when provider health and readiness is ok'() {
        given:
        def provider = "http://localhost:9090"
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS
        def prometheusHealthResponse = "Prometheus is Healthy.\n"
        def prometheusReadinessResponse = "Prometheus is Ready.\n"

        when:
        def result = verifyProviderConnectionInteractorImpl.execute(provider, providerType)

        then:
        1 * serviceFactory.getConnector(providerType) >> providerService
        1 * providerService.healthCheck(provider) >> prometheusHealthResponse
        1 * providerService.readinessCheck(provider) >> prometheusReadinessResponse
        0 * _

        result != null
        result.status == "SUCCESS"
    }

    def 'should return failed when provider health is unavailable'() {
        given:
        def provider = "http://localhost:9090"
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS
        1 * providerService.healthCheck(provider) >> { throw new RuntimeException("error") }

        when:
        def result = verifyProviderConnectionInteractorImpl.execute(provider, providerType)

        then:
        1 * serviceFactory.getConnector(providerType) >> providerService

        result != null
        result.status == "FAILED"
    }

    def 'should return failed when provider readiness is unavailable'() {
        given:
        def provider = "http://localhost:9090"
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS
        1 * providerService.readinessCheck(provider) >> { throw new RuntimeException("error") }

        when:
        def result = verifyProviderConnectionInteractorImpl.execute(provider, providerType)

        then:
        1 * serviceFactory.getConnector(providerType) >> providerService

        result != null
        result.status == "FAILED"
    }
}
