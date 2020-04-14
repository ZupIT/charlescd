/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.request.CreateComposedBuildRequest
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.domain.repository.ModuleRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class CreateComposedBuildInteractorImplTest extends Specification {

    private CreateComposedBuildInteractorImpl createComposedBuildInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private ModuleRepository moduleRepository = Mock(ModuleRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)

    def setup() {
        this.createComposedBuildInteractor = new CreateComposedBuildInteractorImpl(userRepository, moduleRepository, buildRepository)
    }

    def 'when user does not exist should throw exception'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest(author)

        when:
        createComposedBuildInteractor.execute(createComposedBuildRequest, applicationId)

        then:
        1 * userRepository.findById(author.id) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == author.id
    }

    def 'when module does not exist should throw exception'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest(author)

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        when:
        createComposedBuildInteractor.execute(createComposedBuildRequest, applicationId)

        then:
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * moduleRepository.findByIds(listOfModulesId) >> new ArrayList<String>()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "module"
        ex.resource.value == listOfModulesId[0]
    }

    def 'when the composition id is wrong, should create without it'() {

        given:
        def gitRepositoryAddress = 'http://git-repository-address.com'
        def helmRepository = 'http://helm-repository.com'
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest(author)

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        def listOfLabels = new ArrayList()
        listOfLabels.add(new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF'))

        def component = new Component('1a58c67c-6acb-11ea-bc55-0242ac131111', '1a58c280-6acb-11ea-bc55-0242ac130003', 'testing-module',
                '/', 8080, '/health', LocalDateTime.now(), applicationId)

        def listOfComponents = new ArrayList()
        listOfComponents.add(component)

        def module = new Module('1a58c280-6acb-11ea-bc55-0242ac130003', 'Module name', gitRepositoryAddress,
                LocalDateTime.now(), helmRepository, author, listOfLabels,
                new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config',
                        new GitCredentials('Credential address', 'username',
                                'password', 'Access Token', GitServiceProvider.GITHUB),
                        LocalDateTime.now(), author, applicationId), listOfComponents, applicationId,
                '007c5fd6-6e0c-11ea-bc55-0242ac130003', '38513be4-0523-41b2-96ba-1c30cda33d89')

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        when:
        def response = createComposedBuildInteractor.execute(createComposedBuildRequest, applicationId)

        then:
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * moduleRepository.findByIds(listOfModulesId) >> listOfModules
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

    def 'should create composed build successfully'() {

        given:
        def gitRepositoryAddress = 'http://git-repository-address.com'
        def helmRepository = 'http://helm-repository.com'
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        CreateComposedBuildRequest createComposedBuildRequest = getDummyCreateComposedBuildRequest(author)

        def listOfModulesId = new ArrayList()
        listOfModulesId.add(createComposedBuildRequest.modules[0].id)

        def listOfLabels = new ArrayList()
        listOfLabels.add(new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF'))

        def component = new Component('1a58c67c-6acb-11ea-bc55-0242ac130003', '1a58c280-6acb-11ea-bc55-0242ac130003', 'testing-module',
                '/', 8080, '/health', LocalDateTime.now(), applicationId)

        def listOfComponents = new ArrayList()
        listOfComponents.add(component)

        def module = new Module('1a58c280-6acb-11ea-bc55-0242ac130003', 'Module name', gitRepositoryAddress,
                LocalDateTime.now(), helmRepository, author, listOfLabels,
                new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config',
                        new GitCredentials('Credential address', 'username',
                                'password', 'Access Token', GitServiceProvider.GITHUB),
                        LocalDateTime.now(), author, applicationId), listOfComponents, applicationId,
                '007c5fd6-6e0c-11ea-bc55-0242ac130003', '38513be4-0523-41b2-96ba-1c30cda33d89')

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        when:
        def response = createComposedBuildInteractor.execute(createComposedBuildRequest, applicationId)

        then:
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * moduleRepository.findByIds(listOfModulesId) >> listOfModules
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

    private CreateComposedBuildRequest getDummyCreateComposedBuildRequest(User author) {
        def componentRequestList = new ArrayList<CreateComposedBuildRequest.ComponentRequest>()
        componentRequestList.add(new CreateComposedBuildRequest.ComponentRequest('1a58c67c-6acb-11ea-bc55-0242ac130003', 'v-0102', 'Artifact'))

        def moduleRequestList = new ArrayList<CreateComposedBuildRequest.ModuleRequest>()
        moduleRequestList.add(new CreateComposedBuildRequest.ModuleRequest('1a58c280-6acb-11ea-bc55-0242ac130003', componentRequestList))

        return new CreateComposedBuildRequest('release-name', author.id, moduleRequestList)
    }
}
