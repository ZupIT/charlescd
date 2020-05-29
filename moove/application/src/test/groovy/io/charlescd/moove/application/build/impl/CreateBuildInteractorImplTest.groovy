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

import io.charlescd.moove.application.*
import io.charlescd.moove.application.build.CreateBuildInteractor
import io.charlescd.moove.application.build.request.CreateBuildRequest
import io.charlescd.moove.commons.constants.ColumnConstants
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.*
import io.charlescd.moove.domain.service.GitProviderService
import io.charlescd.moove.domain.service.VillagerService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateBuildInteractorImplTest extends Specification {

    private CreateBuildInteractor buildInteractor

    private GitProviderService gitProviderService = Mock(GitProviderService)
    private UserRepository userRepository = Mock(UserRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private HypothesisRepository hypothesisRepository = Mock(HypothesisRepository)
    private VillagerService villagerService = Mock(VillagerService)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)

    def setup() {
        this.buildInteractor = new CreateBuildInteractorImpl(
                gitProviderService,
                new UserService(userRepository),
                new BuildService(buildRepository),
                new HypothesisService(hypothesisRepository),
                villagerService,
                new WorkspaceService(workspaceRepository, userRepository),
                new GitConfigurationService(gitConfigurationRepository)
        )
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
        def workspaceId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'

        def author = getDummyUser()

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId)

        then:
        1 * hypothesisRepository.findById(hypothesisId) >> Optional.empty()
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        def ex = thrown(NotFoundException)
        ex.resourceName == "hypothesis"
        ex.id == hypothesisId

    }

    def 'when author does not exist should throw exception'() {
        given:
        def workspaceId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')

        def author = getDummyUser()

        def hypothesis = new Hypothesis('865758f1-17ea-4f96-8518-3490977fa0ea', 'Hypothesis Name', 'Hypothesis Description', author,
                LocalDateTime.now(), new ArrayList<Column>(), new ArrayList<Build>(), workspaceId)

        def createBuildRequest = new CreateBuildRequest(author.id, featureList, tagName, hypothesis.id)

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * userRepository.findById(author.id) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == author.id
    }

    def 'should return build response'() {

        def hypothesisId = '865758f1-17ea-4f96-8518-3490977fa0ea'
        def workspaceId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')

        def author = getDummyUser()

        def todoCardColumn = new Column('2dd78ca0-6a2c-11ea-bc55-0242ac130003', ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def doingCardColumn = new Column('2dd78ffc-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DOING_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def listOfLabels = new ArrayList()
        listOfLabels.add(getDummyLabel(author))

        def module = new Module('dce51bbc-db52-401b-9d84-ef98d815c04f', 'Module name', 'Git repository address',
                LocalDateTime.now(), 'Helm repository', author, listOfLabels, getDummyGitConfiguration(author, workspaceId), new ArrayList<Component>(),
                workspaceId)

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        def feature = new Feature('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2', 'Feature X', 'branch-name', author,
                LocalDateTime.now(), listOfModules, workspaceId)

        def card = new SoftwareCard('f5242e5a-6aac-11ea-bc55-0242ac130003', 'Developing a feature', 'Description of the card',
                '2dd791e6-6a2c-11ea-bc55-0242ac130003', SoftwareCardTypeEnum.FEATURE, author, LocalDateTime.now(), feature,
                new ArrayList<Comment>(), CardStatusEnum.ACTIVE, new ArrayList<User>(), 0, workspaceId)

        def listOfCards = new ArrayList();
        listOfCards.add(card)

        def readyToGoCardColumn = new Column('2dd7910a-6a2c-11ea-bc55-0242ac130003', ColumnConstants.READY_TO_GO_COLUMN_NAME,
                hypothesisId, listOfCards, workspaceId)

        def buildsCardColumn = new Column('2dd791e6-6a2c-11ea-bc55-0242ac130003', ColumnConstants.BUILDS_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def deployedReleasesCardColumn = new Column('2dd792ae-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = new Hypothesis(hypothesisId, 'Hypothesis Name', 'Hypothesis Description', author,
                LocalDateTime.now(), columns, new ArrayList<Build>(), workspaceId)

        def createBuildRequest = new CreateBuildRequest(author.id, featureList, tagName, hypothesis.id)

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def credentials = new GitCredentials("http://github.com.br", "zup", "zup@123",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("ab84b4df-879b-47b2-90d9-bf5a6708c39d", "GitHub",
                credentials, LocalDateTime.now(), author, "24d4f405-70e2-4908-8f66-f4951e46bc3b")

        when:
        def buildResponse = buildInteractor.execute(createBuildRequest, workspaceId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * userRepository.findById(author.id) >> Optional.of(author)
        1 * buildRepository.save(_) >> { argument ->
            def buildSaved = argument[0]
            assert buildSaved instanceof Build
            assert buildSaved.hypothesisId == hypothesis.id
            assert buildSaved.status == BuildStatusEnum.BUILDING
            assert buildSaved.tag == tagName
            assert buildSaved.columnId == buildsCardColumn.id
            assert buildSaved.workspaceId == workspaceId
            assert buildSaved.author.id == author.id
        }
        1 * gitProviderService.createReleaseCandidates(_, _) >> _
        1 * villagerService.build(_, _) >> _
        1 * gitConfigurationRepository.find(_) >> Optional.of(gitConfiguration)

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

    def 'should throw an exception when an informed feature does not exist or are not ready to go'() {

        def hypothesisId = '865758f1-17ea-4f96-8518-3490977fa0ea'
        def workspaceId = '7bb24df7-ba5d-4e4e-ba7e-f80153a7774a'
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')

        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())

        def todoCardColumn = new Column('2dd78ca0-6a2c-11ea-bc55-0242ac130003', ColumnConstants.TO_DO_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def doingCardColumn = new Column('2dd78ffc-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DOING_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def listOfLabels = new ArrayList()
        listOfLabels.add(getDummyLabel(author))

        def module = new Module('dce51bbc-db52-401b-9d84-ef98d815c04f', 'Module name', 'Git repository address',
                LocalDateTime.now(), 'Helm repository', author, listOfLabels, getDummyGitConfiguration(author, workspaceId), new ArrayList<Component>(),
                workspaceId)

        def listOfModules = new ArrayList()
        listOfModules.add(module)

        def feature = new Feature('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2', 'Feature X', 'branch-name', author,
                LocalDateTime.now(), listOfModules, workspaceId)

        def card = new SoftwareCard('f5242e5a-6aac-11ea-bc55-0242ac130003', 'Developing a feature', 'Description of the card',
                '2dd791e6-6a2c-11ea-bc55-0242ac130003', SoftwareCardTypeEnum.FEATURE, author, LocalDateTime.now(), feature,
                new ArrayList<Comment>(), CardStatusEnum.ACTIVE, new ArrayList<User>(), 0, workspaceId)

        def listOfCards = new ArrayList();
        listOfCards.add(card)

        def readyToGoCardColumn = new Column('2dd7910a-6a2c-11ea-bc55-0242ac130003', ColumnConstants.READY_TO_GO_COLUMN_NAME,
                hypothesisId, listOfCards, workspaceId)

        def buildsCardColumn = new Column('2dd791e6-6a2c-11ea-bc55-0242ac130003', ColumnConstants.BUILDS_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def deployedReleasesCardColumn = new Column('2dd792ae-6a2c-11ea-bc55-0242ac130003', ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME,
                hypothesisId, new ArrayList<Card>(), workspaceId)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = new Hypothesis(hypothesisId, 'Hypothesis Name', 'Hypothesis Description', author,
                LocalDateTime.now(), columns, new ArrayList<Build>(), workspaceId)

        def createBuildRequest = new CreateBuildRequest(author.id, featureList, tagName, hypothesis.id)

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * userRepository.findById(author.id) >> Optional.of(author)

        def exception = thrown(BusinessException)
        assert exception.message == "some.of.informed.features.does.not.exist.or.are.not.ready.to.go"

    }

    private GitConfiguration getDummyGitConfiguration(User author, String workspaceId) {
        new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config', getDummyGitCredentials(),
                LocalDateTime.now(), author, workspaceId)
    }

    private GitCredentials getDummyGitCredentials() {
        new GitCredentials('Credential address', 'username',
                'password', 'Access Token', GitServiceProvider.GITHUB)
    }

    private Label getDummyLabel(User author) {
        new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF')
    }

    private User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }
}
