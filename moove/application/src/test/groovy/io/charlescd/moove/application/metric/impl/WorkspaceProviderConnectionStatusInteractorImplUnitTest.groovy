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

package io.charlescd.moove.application.metric.impl

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusConnectionStatusResponse
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import spock.lang.Specification

import java.time.LocalDateTime

class WorkspaceProviderConnectionStatusInteractorImplUnitTest extends Specification {

    def serviceFactory = Mock(MetricServiceFactory)
    def providerService = Mock(PrometheusService)
    def metricConfigurationRepository = Mock(MetricConfigurationRepository)
    def verifyProviderConnectionInteractorImpl = new VerifyWorkspaceProviderConnectionInteractorImpl(serviceFactory, metricConfigurationRepository)

    def workspaceId = "workspace-id"
    def providerId = "provider-id"
    def url = "http://localhost:9090"

    def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
            "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

    def metricConfiguration = new MetricConfiguration("provider-id", MetricConfiguration.ProviderEnum.PROMETHEUS, url,
            LocalDateTime.now(), workspaceId, author)

    def 'should return success when provider readiness is ok'() {
        given:
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS
        def prometheusReadinessResponse = new PrometheusConnectionStatusResponse(
                "SUCCESS", 200, "Prometheus is Ready")

        when:
        def result = verifyProviderConnectionInteractorImpl.execute(workspaceId, providerId, providerType)

        then:
        1 * serviceFactory.getConnector(providerType) >> providerService
        1 * metricConfigurationRepository.find(providerId, workspaceId) >> Optional.of(metricConfiguration)
        1 * providerService.readinessCheck(url) >> prometheusReadinessResponse
        0 * _

        result != null
        result.status == "SUCCESS"
    }

    def 'should return failed when provider readiness is unavailable'() {
        given:
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS
        def prometheusReadinessResponse = new PrometheusConnectionStatusResponse(
                "FAILED", 500, "Prometheus is not Ready")

        when:
        def result = verifyProviderConnectionInteractorImpl.execute(workspaceId, providerId, providerType)

        then:
        1 * serviceFactory.getConnector(providerType) >> providerService
        1 * metricConfigurationRepository.find(providerId, workspaceId) >> Optional.of(metricConfiguration)
        1 * providerService.readinessCheck(url) >> prometheusReadinessResponse
        0 * _

        result != null
        result.status == "FAILED"
    }
}
