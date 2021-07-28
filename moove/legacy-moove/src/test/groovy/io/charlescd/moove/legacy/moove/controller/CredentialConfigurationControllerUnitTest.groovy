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

package io.charlescd.moove.legacy.moove.controller


import io.charlescd.moove.legacy.moove.api.request.GitProvidersEnum
import io.charlescd.moove.legacy.moove.api.request.K8sClusterProvidersEnum
import io.charlescd.moove.legacy.moove.request.configuration.CreateGCPRegistryConfigurationRequest
import io.charlescd.moove.legacy.moove.request.configuration.CreateOctopipeCdConfigurationData
import io.charlescd.moove.legacy.moove.request.configuration.CreateOctopipeCdConfigurationRequest
import io.charlescd.moove.legacy.moove.request.configuration.TestRegistryConnectionRequest
import io.charlescd.moove.legacy.moove.service.CredentialConfigurationService
import spock.lang.Specification

class CredentialConfigurationControllerUnitTest extends Specification {

    String workspaceId = "81861b6f-2b6e-44a1-a745-83e298a550c9"
    String generalId = "aas61b6f-2b6e-44a1-a745-83e298aj3d112"
    String authorization = "qwerty123"

    CredentialConfigurationService service = Mock(CredentialConfigurationService)
    CredentialConfigurationController controller

    def "setup"() {
        controller = new CredentialConfigurationController(service)
    }

    def "should create registry config"() {
        given:
        def request = new CreateGCPRegistryConfigurationRequest("GCP", "https://gcp.com.io", "charlescd", "{}")

        when:
        controller.createRegistryConfig(workspaceId, authorization, null, request)

        then:
        1 * service.createRegistryConfig(request, workspaceId, authorization, null)
    }

    def "should create cd config"() {
        given:

        def configData = new CreateOctopipeCdConfigurationData(
            GitProvidersEnum.GITHUB, K8sClusterProvidersEnum.DEFAULT,
                null, null, null, null, null, null, null, null, null, null)

        def request = new CreateOctopipeCdConfigurationRequest(configData, "octopite")

        when:
        controller.createCdConfig(workspaceId, authorization, null, request)

        then:
        1 * service.createCdConfig(request, workspaceId, authorization, null)
        notThrown()
    }

    def "should get configurations by type"() {
        given:

        when:
        controller.getConfigurationsByType(workspaceId)

        then:
        1 * service.getConfigurationsByType(workspaceId)
        notThrown()
    }

    def "should get configurations by id"() {
        given:

        when:
        controller.getConfigurationById(workspaceId, generalId)

        then:
        1 * service.getConfigurationById(generalId, workspaceId)
        notThrown()
    }

    def "should test registry config"() {
        given:
        def request = new CreateGCPRegistryConfigurationRequest("GCP", "https://gcp.com.io", "charlescd", "{}")

        when:
        controller.configurationValidation(workspaceId, request, null, authorization)

        then:
        notThrown()
    }

    def "should test registry connection"() {
        given:
        def request = new TestRegistryConnectionRequest(generalId);

        when:
        controller.connectionValidation(workspaceId, request)

        then:
        1 * service.testRegistryConnection(workspaceId, request)
        notThrown()
    }





}
