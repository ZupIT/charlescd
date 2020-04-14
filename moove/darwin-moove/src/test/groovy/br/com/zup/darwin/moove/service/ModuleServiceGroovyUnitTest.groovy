/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.VillagerApi
import br.com.zup.darwin.moove.api.response.ComponentTagsResponse
import br.com.zup.darwin.repository.*
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class ModuleServiceGroovyUnitTest extends Specification {

    private ModuleService moduleService

    private String applicationId = "application-id"

    // mocks
    private UserRepository userRepository = Mock(UserRepository)
    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private LabelRepository labelRepository = Mock(LabelRepository)
    private ComponentRepository componentRepository = Mock(ComponentRepository)
    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private VillagerApi villagerApi = Mock(VillagerApi)
    private DeployApi deployApi = Mock(DeployApi)

    // test instances
    private String componentId = "ee09b9e8-8ea9-4492-ace9-2bbe5a7f984e"
    private String moduleId = "ee09b9e8-8ea9-4492-ace9-2bbe5a7faaaa"
    private String gitConfigId = "b278d275-084f-4618-a0bc-0e3a8a3e01b2"
    private String cdConfigurationId = "k8s-id"
    private String registryConfigurationId = "registry-id"
    private List components = []
    private User author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com", "https://www.photos.com/johndoe", [], LocalDateTime.now())
    private GitCredentials gitCredentials = new GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
    private GitConfiguration gitConfiguration = new GitConfiguration(gitConfigId, "config", LocalDateTime.now(), author, applicationId, gitCredentials)
    private Module module = new Module(
            moduleId,
            "module",
            "gitRepositoryAddress",
            LocalDateTime.of(2019, 12, 1, 0, 0),
            "helm-repository",
            author,
            [],
            components,
            applicationId,
            gitConfiguration,
            cdConfigurationId,
            registryConfigurationId
    )
    private Component component = new Component(componentId, "component", "path", 8080, "health", LocalDateTime.of(2019, 12, 1, 0, 0), module, [], applicationId)
    private ComponentTagsResponse componentTagsResponse = new ComponentTagsResponse([
            new ComponentTagsResponse.TagResponse("name-tag-1", "artifact-tag-1"),
            new ComponentTagsResponse.TagResponse("name-tag-2", "artifact-tag-2")
    ])

    def setup() {
        module.getComponents().add(component)
        moduleService = new ModuleService(userRepository, moduleRepository, labelRepository, componentRepository, gitConfigurationRepository, villagerApi, deployApi)
    }

    def "should return all tags of a component"() {

        when:
        def response = moduleService.getComponentTags(component.id, applicationId)

        then:
        1 * componentRepository.findByIdAndApplicationId(component.id, applicationId) >> Optional.of(component)
        1 * villagerApi.getComponentTags(component.module.registryConfigurationId, component.getName(), applicationId) >> componentTagsResponse
        response.tags.size() == 2
        response.tags[0].name == componentTagsResponse.tags[0].name
        response.tags[0].artifact == componentTagsResponse.tags[0].artifact
        response.tags[1].name == componentTagsResponse.tags[1].name
        response.tags[1].artifact == componentTagsResponse.tags[1].artifact

    }

    def "should throw exception when a component does not exist"() {

        when:
        moduleService.getComponentTags(component.id, applicationId)

        then:
        1 * componentRepository.findByIdAndApplicationId(component.id, applicationId) >> Optional.empty()

        thrown(NotFoundException)

    }


    def "should return an empty list of tags"() {

        when:
        def response = moduleService.getComponentTags(component.id, applicationId)

        then:
        1 * componentRepository.findByIdAndApplicationId(component.id, applicationId) >> Optional.of(component)
        1 * villagerApi.getComponentTags(component.module.registryConfigurationId, component.getName(), applicationId) >> new ComponentTagsResponse(Collections.emptyList())
        response.tags.size() == 0

    }

}
