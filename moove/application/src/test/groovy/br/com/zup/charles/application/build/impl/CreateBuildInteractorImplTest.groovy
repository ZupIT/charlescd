/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.CreateBuildInteractor
import br.com.zup.charles.application.build.request.CreateBuildRequest
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.domain.repository.HypothesisRepository
import br.com.zup.charles.domain.repository.UserRepository
import br.com.zup.charles.domain.service.GitProviderService
import br.com.zup.charles.domain.service.VillagerService
import br.com.zup.darwin.commons.constants.ColumnConstants
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class CreateBuildInteractorImplTest extends Specification {

    private CreateBuildInteractor buildInteractor

    private GitProviderService gitProviderService = Mock(GitProviderService)
    private UserRepository userRepository = Mock(UserRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private HypothesisRepository hypothesisRepository = Mock(HypothesisRepository)
    private VillagerService villagerService = Mock(VillagerService)

    def setup() {
        this.buildInteractor = new CreateBuildInteractorImpl(gitProviderService, userRepository, buildRepository, hypothesisRepository, villagerService)
    }

    def 'when hypothesis does not exist should throw exception'() {

        given:
        def authorId = '4e806b2a-557b-45c5-91be-1e1db909bef6'
        def hypothesisId = '865758f1-17ea-4f96-8518-3490977fa0ea'
        def tagName = 'charles-cd-build-testing'

        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')

        def createBuildRequest = new CreateBuildRequest(authorId, featureList, tagName, hypothesisId)
        def applicationId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'

        when:
        buildInteractor.execute(createBuildRequest, applicationId)

        then:
        1 * hypothesisRepository.findById(hypothesisId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "hypothesis"
        ex.resource.value == hypothesisId

    }

    def 'when author does not exist should throw exception'() {

        given:
        def applicationId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        def hypothesis = new Hypothesis('865758f1-17ea-4f96-8518-3490977fa0ea', 'Hypothesis Name', 'Hypothesis Description', author,
                LocalDateTime.now(), '775758f1-17ea-4f96-8518-3490977fa0bb', new ArrayList<Column>(), new ArrayList<Build>(), applicationId)

        def createBuildRequest = new CreateBuildRequest(author.id, featureList, tagName, hypothesis.id)

        when:
        buildInteractor.execute(createBuildRequest, applicationId)

        then:
        1 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * userRepository.findById(author.id) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "user"
        ex.resource.value == author.id
    }

    def 'should return build response'() {

        def hypothesisId = '865758f1-17ea-4f96-8518-3490977fa0ea'
        def applicationId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        def todoCardColumn = new Column('2dd78ca0-6a2c-11ea-bc55-0242ac130003', ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), applicationId)

        def doingCardColumn = new Column('2dd78ffc-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DOING_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), applicationId)

        def listOfLabels = new ArrayList()
        listOfLabels.add(getDummyLabel(author))

        def module = new Module('dce51bbc-db52-401b-9d84-ef98d815c04f', 'Module name', 'Git repository address',
                LocalDateTime.now(), 'Helm repository', author, listOfLabels, getDummyGitConfiguration(author, applicationId), new ArrayList<Component>(),
                applicationId,'007c5fd6-6e0c-11ea-bc55-0242ac130003', '38513be4-0523-41b2-96ba-1c30cda33d89')

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        def feature = new Feature('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2', 'Feature X', 'branch-name', author,
                LocalDateTime.now(), listOfModules, applicationId)

        def card = new SoftwareCard('f5242e5a-6aac-11ea-bc55-0242ac130003', 'Developing a feature', 'Description of the card',
                '2dd791e6-6a2c-11ea-bc55-0242ac130003', SoftwareCardTypeEnum.FEATURE, author, LocalDateTime.now(), feature,
                new ArrayList<Comment>(), CardStatusEnum.ACTIVE, new ArrayList<User>(), 0, applicationId)

        def listOfCards = new ArrayList();
        listOfCards.add(card)

        def readyToGoCardColumn = new Column('2dd7910a-6a2c-11ea-bc55-0242ac130003', ColumnConstants.READY_TO_GO_COLUMN_NAME,
                hypothesisId, listOfCards, applicationId)

        def buildsCardColumn = new Column('2dd791e6-6a2c-11ea-bc55-0242ac130003', ColumnConstants.BUILDS_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), applicationId)

        def deployedReleasesCardColumn = new Column('2dd792ae-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), applicationId)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = new Hypothesis(hypothesisId, 'Hypothesis Name', 'Hypothesis Description', author,
                LocalDateTime.now(), '775758f1-17ea-4f96-8518-3490977fa0bb', columns, new ArrayList<Build>(), applicationId)

        def createBuildRequest = new CreateBuildRequest(author.id, featureList, tagName, hypothesis.id)

        when:
        def buildResponse = buildInteractor.execute(createBuildRequest, applicationId)

        then:
        1 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * buildRepository.save(_) >> { argument ->
            def buildSaved = argument[0]
            assert buildSaved instanceof Build
            assert buildSaved.hypothesisId == hypothesis.id
            assert buildSaved.status == BuildStatusEnum.BUILDING
            assert buildSaved.tag == tagName
            assert buildSaved.columnId == buildsCardColumn.id
            assert buildSaved.applicationId == applicationId
            assert buildSaved.author.id == author.id
        }
        1 * gitProviderService.createReleaseCandidates(_) >> _
        1 * villagerService.build(_) >> _

        notThrown()

        buildResponse != null
        buildResponse.id != null
        buildResponse.author.id == author.id
        buildResponse.tag == tagName
        buildResponse.status == BuildStatusEnum.BUILDING.name()
        buildResponse.features.size() == 1
        buildResponse.createdAt != null
        buildResponse.deployments.size() == 0
    }

    private GitConfiguration getDummyGitConfiguration(User author, String applicationId) {
        new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config', getDummyGitCredentials(),
                LocalDateTime.now(), author, applicationId)
    }

    private GitCredentials getDummyGitCredentials() {
        new GitCredentials('Credential address', 'username',
                'password', 'Access Token', GitServiceProvider.GITHUB)
    }

    private Label getDummyLabel(User author) {
        new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF')
    }
}