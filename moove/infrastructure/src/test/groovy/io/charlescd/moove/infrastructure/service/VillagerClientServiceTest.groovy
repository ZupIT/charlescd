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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.VillagerService
import io.charlescd.moove.infrastructure.service.client.*
import io.charlescd.moove.infrastructure.service.client.request.CreateVillagerRegistryConfigurationRequest
import io.charlescd.moove.infrastructure.service.client.response.CreateVillagerRegistryConfigurationResponse
import io.charlescd.moove.infrastructure.service.client.response.FindComponentTagsResponse
import io.charlescd.moove.infrastructure.service.client.response.FindVillagerRegistryConfigurationsResponse
import spock.lang.Specification

import java.time.LocalDateTime

class VillagerClientServiceTest extends Specification {

    private VillagerService villagerService

    private VillagerClient villagerClient = Mock(VillagerClient)

    def setup() {
        villagerService = new VillagerClientService(villagerClient)
    }

    def 'when creating aws registry configuration, should do it successfully'() {
        given:
        def villagerResponse = new CreateVillagerRegistryConfigurationResponse('w8098b2a-557b-45c5-91be-1e1db909mo5g')
        def author = getDummyUser()
        def workspace = getDummyWorkspace(author)
        def registryConfiguration = new AWSRegistryConfiguration('Registry Name', 'Address', author, 'Hostname', workspace,
                'Access Key', 'Secret Key', 'Region')

        when:
        def receivedId = villagerService.createRegistryConfiguration(registryConfiguration)

        then:
        1 * villagerClient.createRegistryConfiguration(_, workspace.id) >> { arguments ->
            def villagerRequest = arguments[0]
            assert villagerRequest instanceof CreateVillagerRegistryConfigurationRequest
            villagerRequest.name == registryConfiguration.name
            villagerRequest.address == registryConfiguration.address
            villagerRequest.username == null
            villagerRequest.password == null
            villagerRequest.accessKey == registryConfiguration.accessKey
            villagerRequest.secretKey == registryConfiguration.secretKey
            villagerRequest.region == registryConfiguration.region
            villagerRequest.authorId == registryConfiguration.author.id

            villagerResponse
        }

        receivedId == villagerResponse.id
    }

    def 'when creating azure registry configuration, should do it successfully'() {
        given:
        def villagerResponse = new CreateVillagerRegistryConfigurationResponse('w8098b2a-557b-45c5-91be-1e1db909mo5g')
        def author = getDummyUser()
        def workspace = getDummyWorkspace(author)
        def registryConfiguration = new AzureRegistryConfiguration('Registry Name', 'Address', author, 'Hostname', workspace,
                'Username', 'Password')

        when:
        def receivedId = villagerService.createRegistryConfiguration(registryConfiguration)

        then:
        1 * villagerClient.createRegistryConfiguration(_, workspace.id) >> { arguments ->
            def villagerRequest = arguments[0]
            assert villagerRequest instanceof CreateVillagerRegistryConfigurationRequest
            villagerRequest.name == registryConfiguration.name
            villagerRequest.address == registryConfiguration.address
            villagerRequest.username == registryConfiguration.username
            villagerRequest.password == registryConfiguration.password
            villagerRequest.accessKey == null
            villagerRequest.secretKey == null
            villagerRequest.region == null
            villagerRequest.authorId == registryConfiguration.author.id

            villagerResponse
        }

        receivedId == villagerResponse.id
    }

    def 'when checking if registry exists, if exists should return true'() {
        given:
        def workspaceId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def registryId = '00000000-557b-45c5-91be-1e1db909bef6'
        def villagerResult = [new FindVillagerRegistryConfigurationsResponse(registryId, "Name", "authorId"),
                              new FindVillagerRegistryConfigurationsResponse("registryId", "Name", "authorId")
        ]

        when:
        def result = villagerService.checkIfRegistryConfigurationExists(registryId, workspaceId)

        then:
        1 * villagerClient.findRegistryConfigurations(workspaceId) >> villagerResult

        result
    }

    def 'when checking if registry exists, if it does not should return false'() {
        given:
        def workspaceId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def registryId = '00000000-557b-45c5-91be-1e1db909bef6'
        def villagerResult = [new FindVillagerRegistryConfigurationsResponse("registryId1", "Name", "authorId"),
                              new FindVillagerRegistryConfigurationsResponse("registryId", "Name", "authorId")
        ]

        when:
        def result = villagerService.checkIfRegistryConfigurationExists(registryId, workspaceId)

        then:
        1 * villagerClient.findRegistryConfigurations(workspaceId) >> villagerResult

        !result
    }

    def 'when deleting registry configuration, should do it successfully'() {
        given:
        def workspaceId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def registryId = '00000000-557b-45c5-91be-1e1db909bef6'

        when:
        villagerService.delete(registryId, workspaceId)

        then:
        1 * villagerClient.deleteRegistryConfiguration(registryId, workspaceId)
    }

    def 'when getting registry name by id, if exists should return it'() {
        given:
        def workspaceId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def registryId = '00000000-557b-45c5-91be-1e1db909bef6'
        def registryName = "Name 1"
        def villagerResult = [new FindVillagerRegistryConfigurationsResponse(registryId, registryName, "authorId"),
                              new FindVillagerRegistryConfigurationsResponse("registryId", "Name 2", "authorId")
        ]

        when:
        def response = villagerService.findRegistryConfigurationNameById(registryId, workspaceId)

        then:
        1 * villagerClient.findRegistryConfigurations(workspaceId) >> villagerResult

        response == registryName
    }

    def 'when getting registry name by id, if it does not exist should return it'() {
        given:
        def workspaceId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def registryId = '00000000-557b-45c5-91be-1e1db909bef6'
        def villagerResult = [new FindVillagerRegistryConfigurationsResponse("registryId1", "Name 1", "authorId"),
                              new FindVillagerRegistryConfigurationsResponse("registryId2", "Name 2", "authorId")
        ]

        when:
        def response = villagerService.findRegistryConfigurationNameById(registryId, workspaceId)

        then:
        1 * villagerClient.findRegistryConfigurations(workspaceId) >> villagerResult

        response == null
    }

    def 'when getting component tags by componentName, workspaceId and registryConfigurationId, if exists should return it'() {
        given:
        def componentName = "3531d59f-af22-4f45-8c88-30c1f5aaee8e"
        def registryConfigurationId = "7477194c-2214-46a7-b4de-d232b34640e9"
        def workspaceId = "34eb6535-02ef-4756-af22-459d004d9121"
        def componentTagName = "V-1.1.0"

        def componentTagsResponse = new FindComponentTagsResponse(
                [
                        new FindComponentTagsResponse.ComponentTag("component", "azure.acr/component:V-1.1.0"),
                ]
        )

        when:
        def response = villagerService.findComponentTags(componentName, registryConfigurationId,componentTagName, workspaceId)

        then:
        1 * villagerClient.findComponentTags(registryConfigurationId, componentName,componentTagName, workspaceId) >> componentTagsResponse

        assert response != null
        assert response.size() == 1
        assert response[0].name == "component"
        assert response[0].artifact == "azure.acr/component:V-1.1.0"
    }

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }

    private Workspace getDummyWorkspace(User author) {
        new Workspace("2m000b2a-557b-45c5-91be-1e1db909bef6", "Workspace name", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.INCOMPLETE, null, null, null, null, null)
    }
}
