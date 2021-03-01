package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.metrics.connector.MetricServiceFactory
import io.charlescd.moove.metrics.connector.prometheus.PrometheusConnectionStatusResponse
import io.charlescd.moove.metrics.connector.prometheus.PrometheusService
import spock.lang.Specification

class ProviderConnectionStatusInteractorImplTest extends Specification {

    private ProviderConnectionStatusInteractorImpl providerConnectionStatusInteractor
    private MetricServiceFactory metricServiceFactory = Mock(MetricServiceFactory)
    private PrometheusService prometheusService = Mock(PrometheusService)

    def setup() {
        providerConnectionStatusInteractor = new ProviderConnectionStatusInteractorImpl(metricServiceFactory)
    }

    void "when request status of provider conextion then return status ok"() {
        given:
        PrometheusConnectionStatusResponse response = new PrometheusConnectionStatusResponse("ok", 0, "Successfully")
        def providerType = MetricConfiguration.ProviderEnum.PROMETHEUS

        when:
        providerConnectionStatusInteractor.execute("prometheus", providerType)

        then:
        1 * metricServiceFactory.getConnector(providerType) >> prometheusService
        1 * prometheusService.readinessCheck(_) >> response
    }
}
