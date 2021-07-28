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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.SystemTokenService
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.build.request.CreateComposedBuildRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.domain.repository.ModuleRepository
import io.charlescd.moove.domain.repository.SystemTokenRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateComposedBuildInteractorImplTest extends Specification {

    private CreateComposedBuildInteractorImpl createComposedBuildInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private SystemTokenRepository systemTokenRepository = Mock(SystemTokenRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(systemTokenRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        this.createComposedBuildInteractor = new CreateComposedBuildInteractorImpl(
                new UserService(userRepository, systemTokenService, managementUserSecurityService),
                new ModuleService(moduleRepository),
                new BuildService(buildRepository)
        )
    }

    def 'when user does not exist should throw exception'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest()

        when:
        createComposedBuildInteractor.execute(createComposedBuildRequest, workspaceId, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> "email@email.com"
        1 * userRepository.findByEmail("email@email.com") >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
    }

    def 'when module does not exist should throw exception'() {
        given:
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = TestUtils.user
        def authorization = TestUtils.authorization

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest()

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        when:
        createComposedBuildInteractor.execute(createComposedBuildRequest, workspaceId, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * moduleRepository.findByIdsAndWorkpaceId(listOfModulesId, workspaceId) >> new ArrayList<String>()

        def ex = thrown(NotFoundException)
        ex.resourceName == "module"
        ex.id == listOfModulesId[0]
    }

    def 'when the composition id is wrong, should create without it'() {

        given:
        def gitRepositoryAddress = 'http://git-repository-address.com'
        def helmRepository = 'http://helm-repository.com'
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def author = TestUtils.user

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest()

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        def listOfLabels = new ArrayList()
        listOfLabels.add(new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF'))

        def component = new Component('1a58c67c-6acb-11ea-bc55-0242ac131111', '1a58c280-6acb-11ea-bc55-0242ac130003', 'testing-module',
                LocalDateTime.now(), workspaceId, 10, 10, 'host', 'gateway')

        def listOfComponents = new ArrayList()
        listOfComponents.add(component)

        def module = new Module('1a58c280-6acb-11ea-bc55-0242ac130003', 'Module name', gitRepositoryAddress,
                LocalDateTime.now(), helmRepository, author, listOfLabels,
                new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config',
                        new GitCredentials('Credential address', 'username',
                                'password', 'Access Token', GitServiceProvider.GITHUB),
                        LocalDateTime.now(), author, workspaceId), listOfComponents, workspaceId)

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        when:
        def response = createComposedBuildInteractor.execute(createComposedBuildRequest, workspaceId, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * moduleRepository.findByIdsAndWorkpaceId(listOfModulesId, workspaceId) >> listOfModules
        1 * buildRepository.save(_) >> { argument ->
            def buildSaved = argument[0]
            assert buildSaved instanceof Build
            assert buildSaved.features != null
            assert buildSaved.features[0].modules.size() == 1
            assert buildSaved.features[0].modules[0].components.size() == 0

            return buildSaved
        }

        notThrown()

        response != null
        response.status == BuildStatusEnum.BUILT.name()
        response.tag == createComposedBuildRequest.releaseName
        response.deployments.size() == 0
        response.features.size() == 1
        response.features[0].modules.size() == 1
        response.features[0].modules[0].name == module.name
        response.features[0].modules[0].gitRepositoryAddress == gitRepositoryAddress
        response.features[0].modules[0].helmRepository == helmRepository
        response.features[0].authorId == author.id
        response.features[0].authorName == author.name
        response.features[0].branches.size() == 1
        response.features[0].branches[0] == gitRepositoryAddress + '/tree/' + createComposedBuildRequest.releaseName
        response.features[0].branchName == createComposedBuildRequest.releaseName
    }

    def 'should create composed build using authorization'() {

        given:
        def gitRepositoryAddress = 'http://git-repository-address.com'
        def helmRepository = 'http://helm-repository.com'
        def workspaceId = TestUtils.workspaceId
        def author = TestUtils.user
        def authorization = TestUtils.authorization

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest()

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        def listOfLabels = new ArrayList()
        listOfLabels.add(new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF'))

        def component = new Component('1a58c67c-6acb-11ea-bc55-0242ac130003', '1a58c280-6acb-11ea-bc55-0242ac130003', 'testing-module',
                LocalDateTime.now(), workspaceId, 10, 01, 'host', 'gateway')

        def listOfComponents = new ArrayList()
        listOfComponents.add(component)

        def module = new Module('1a58c280-6acb-11ea-bc55-0242ac130003', 'Module name', gitRepositoryAddress,
                LocalDateTime.now(), helmRepository, author, listOfLabels,
                new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config',
                        new GitCredentials('Credential address', 'username',
                                'password', 'Access Token', GitServiceProvider.GITHUB),
                        LocalDateTime.now(), author, workspaceId), listOfComponents, workspaceId)

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        when:
        def response = createComposedBuildInteractor.execute(createComposedBuildRequest, workspaceId, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * moduleRepository.findByIdsAndWorkpaceId(listOfModulesId, workspaceId) >> listOfModules
        1 * buildRepository.save(_) >> { argument ->
            def buildSaved = argument[0]
            assert buildSaved instanceof Build
            assert buildSaved.features != null
            assert buildSaved.features[0].modules.size() == 1
            assert buildSaved.features[0].modules[0].components.size() == 1

            return buildSaved
        }

        notThrown()

        response != null
        response.status == BuildStatusEnum.BUILT.name()
        response.tag == createComposedBuildRequest.releaseName
        response.deployments.size() == 0
        response.features.size() == 1
        response.features[0].modules.size() == 1
        response.features[0].modules[0].name == module.name
        response.features[0].modules[0].gitRepositoryAddress == gitRepositoryAddress
        response.features[0].modules[0].helmRepository == helmRepository
        response.features[0].authorId == author.id
        response.features[0].authorName == author.name
        response.features[0].branches.size() == 1
        response.features[0].branches[0] == gitRepositoryAddress + '/tree/' + createComposedBuildRequest.releaseName
        response.features[0].branchName == createComposedBuildRequest.releaseName
    }

    def 'should create composed build using system token'() {

        given:
        def gitRepositoryAddress = 'http://git-repository-address.com'
        def helmRepository = 'http://helm-repository.com'
        def workspaceId = TestUtils.workspaceId
        def author = TestUtils.user
        def systemTokenValue = TestUtils.systemTokenValue
        def systemTokenId = TestUtils.systemTokenId

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest()

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        def listOfLabels = new ArrayList()
        listOfLabels.add(new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF'))

        def component = new Component('1a58c67c-6acb-11ea-bc55-0242ac130003', '1a58c280-6acb-11ea-bc55-0242ac130003', 'testing-module',
                LocalDateTime.now(), workspaceId, 10, 01, 'host', 'gateway')

        def listOfComponents = new ArrayList()
        listOfComponents.add(component)

        def module = new Module('1a58c280-6acb-11ea-bc55-0242ac130003', 'Module name', gitRepositoryAddress,
                LocalDateTime.now(), helmRepository, author, listOfLabels,
                new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config',
                        new GitCredentials('Credential address', 'username',
                                'password', 'Access Token', GitServiceProvider.GITHUB),
                        LocalDateTime.now(), author, workspaceId), listOfComponents, workspaceId)

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        when:
        def response = createComposedBuildInteractor.execute(createComposedBuildRequest, workspaceId, null, systemTokenValue)

        then:
        1 * systemTokenRepository.getIdByTokenValue(systemTokenValue) >> systemTokenId
        1 * userRepository.findBySystemTokenId(systemTokenId) >> Optional.of(author)
        1 * moduleRepository.findByIdsAndWorkpaceId(listOfModulesId, workspaceId) >> listOfModules
        1 * buildRepository.save(_) >> { argument ->
            def buildSaved = argument[0]
            assert buildSaved instanceof Build
            assert buildSaved.features != null
            assert buildSaved.features[0].modules.size() == 1
            assert buildSaved.features[0].modules[0].components.size() == 1

            return buildSaved
        }

        notThrown()

        response != null
        response.status == BuildStatusEnum.BUILT.name()
        response.tag == createComposedBuildRequest.releaseName
        response.deployments.size() == 0
        response.features.size() == 1
        response.features[0].modules.size() == 1
        response.features[0].modules[0].name == module.name
        response.features[0].modules[0].gitRepositoryAddress == gitRepositoryAddress
        response.features[0].modules[0].helmRepository == helmRepository
        response.features[0].authorId == author.id
        response.features[0].authorName == author.name
        response.features[0].branches.size() == 1
        response.features[0].branches[0] == gitRepositoryAddress + '/tree/' + createComposedBuildRequest.releaseName
        response.features[0].branchName == createComposedBuildRequest.releaseName
    }

    private static CreateComposedBuildRequest getDummyCreateComposedBuildRequest() {
        def componentRequestList = new ArrayList<CreateComposedBuildRequest.ComponentRequest>()
        componentRequestList.add(new CreateComposedBuildRequest.ComponentRequest('1a58c67c-6acb-11ea-bc55-0242ac130003', 'v-0102', 'Artifact'))

        def moduleRequestList = new ArrayList<CreateComposedBuildRequest.ModuleRequest>()
        moduleRequestList.add(new CreateComposedBuildRequest.ModuleRequest('1a58c280-6acb-11ea-bc55-0242ac130003', componentRequestList))

        return new CreateComposedBuildRequest('release-name', moduleRequestList)
    }
}
