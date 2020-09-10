/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.application.configuration.impl

import io.charlescd.moove.application.MetricConfigurationService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateMetricConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateMetricConfigurationRequest
import io.charlescd.moove.domain.MetricConfiguration
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.MetricConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.metrics.connector.compass.CompassApi
import io.charlescd.moove.metrics.connector.compass.CompassCreateDatasourceRequest
import io.charlescd.moove.metrics.connector.compass.CompassDatasourceResponse
import io.charlescd.moove.metrics.connector.compass.DatasourceDataResponse
import spock.lang.Specification

import java.sql.Timestamp
import java.time.LocalDateTime

class CreateMetricConfigurationInteractorImplTest extends Specification {

    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private MetricConfigurationRepository metricConfigurationRepository = Mock(MetricConfigurationRepository)
    private CompassApi compassApi = Mock(CompassApi)

    private CreateMetricConfigurationInteractor interactor

    def pluginId = '0e0fe5c9-cc20-42d8-a099-9eeb993c5880'
    def health = true
    def providerUrl = 'https://metric-provider.com.br'

    def setup() {
        this.interactor = new CreateMetricConfigurationInteractorImpl(new WorkspaceService(workspaceRepository, userRepository),
                new UserService(userRepository), new MetricConfigurationService(metricConfigurationRepository, compassApi))
    }

    def 'when workspace does not exist should throw exception'() {
        given:
        def workspaceId = '1d637429-4e69-4742-a8b0-af91c01d9608'
        def request = new CreateMetricConfigurationRequest(MetricConfiguration.ProviderEnum.PROMETHEUS, '01f952ad-8fcf-456e-9aa5-40291548f544',
                'https://metric-provider.com.br')

        when:
        interactor.execute(request, workspaceId)

        then:
        1 * workspaceRepository.exists(workspaceId) >> false

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }

    def 'when user does not exist should throw exception'() {
        given:
        def authorId = '01f952ad-8fcf-456e-9aa5-40291548f544'
        def workspaceId = '1d637429-4e69-4742-a8b0-af91c01d9608'
        def request = new CreateMetricConfigurationRequest(MetricConfiguration.ProviderEnum.PROMETHEUS, authorId,
                'https://metric-provider.com.br')

        when:
        interactor.execute(request, workspaceId)

        then:
        1 * workspaceRepository.exists(workspaceId) >> true
        1 * userRepository.findById(authorId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == authorId
    }

    def 'should create metric configuration successfully'() {
        given:
        def author = new User('01f952ad-8fcf-456e-9aa5-40291548f544', "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def workspaceId = '1d637429-4e69-4742-a8b0-af91c01d9608'
        def request = new CreateMetricConfigurationRequest(MetricConfiguration.ProviderEnum.PROMETHEUS, author.id,
                'https://metric-provider.com.br')
        def datasourceResponseData = new DatasourceDataResponse(providerUrl)
        def datasourceResponse = new CompassDatasourceResponse('b763c8d9-ddf6-4fc5-b495-5e9a68e89390', new Timestamp(1580157300L),
                "prometheus", pluginId, health, datasourceResponseData)
        def emptyList = []

        when:
        def response = interactor.execute(request, workspaceId)

        then:
        1 * workspaceRepository.exists(workspaceId) >> true
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * compassApi.findDatasource(workspaceId, true) >> emptyList
        1 * compassApi.saveHealthyDatasource(_, _) >> { arguments ->
            def workspaceRule = arguments[0]
            def datReq = arguments[1]
            assert workspaceRule instanceof String
            assert datReq instanceof CompassCreateDatasourceRequest

            datasourceResponse
        }
        1 * metricConfigurationRepository.save(_) >> { arguments ->
            def metricConfigurationSaved = arguments[0]
            assert metricConfigurationSaved instanceof MetricConfiguration

            metricConfigurationSaved.id != null
            metricConfigurationSaved.provider == request.provider
            metricConfigurationSaved.workspaceId == workspaceId
            metricConfigurationSaved.createdAt != null
            metricConfigurationSaved.author != null
            metricConfigurationSaved.author.id == author.id
            metricConfigurationSaved.author.name == author.name
            metricConfigurationSaved.author.createdAt == author.createdAt
            metricConfigurationSaved.author.email == author.email
            metricConfigurationSaved.author.photoUrl == author.photoUrl
            metricConfigurationSaved.author.workspaces == author.workspaces

            metricConfigurationSaved
        }

        notThrown()
        response.id != null
        response.provider == request.provider.name()
    }
}
