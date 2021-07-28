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
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.domain.service.VillagerService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateBuildInteractorImplTest extends Specification {

    private CreateBuildInteractor buildInteractor

    private GitProviderService gitProviderService = Mock(GitProviderService)
    private UserRepository userRepository = Mock(UserRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private SystemTokenRepository systemTokenRepository = Mock(SystemTokenRepository)
    private HypothesisRepository hypothesisRepository = Mock(HypothesisRepository)
    private VillagerService villagerService = Mock(VillagerService)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private SystemTokenService systemTokenService = new SystemTokenService(systemTokenRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    def setup() {
        this.buildInteractor = new CreateBuildInteractorImpl(
                gitProviderService,
                new UserService(userRepository, systemTokenService, managementUserSecurityService),
                new BuildService(buildRepository),
                new HypothesisService(hypothesisRepository),
                villagerService,
                new WorkspaceService(workspaceRepository, userRepository),
                new GitConfigurationService(gitConfigurationRepository)
        )
    }

    def 'when hypothesis does not exist should throw exception'() {
        given:
        def hypothesisId = TestUtils.hypothesisId
        def tagName = 'charles-cd-build-testing'
        def workspaceId = TestUtils.workspaceId
        def author = TestUtils.user
        def authorization = TestUtils.authorization

        def featureList = getFeatureList();
        def createBuildRequest = new CreateBuildRequest(featureList, tagName, hypothesisId)

        def workspace = TestUtils.workspace

        when:
        buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * hypothesisRepository.findByIdAndWorkspaceId(hypothesisId, workspaceId) >> Optional.empty()
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        def ex = thrown(NotFoundException)
        ex.resourceName == "hypothesis"
        ex.id == hypothesisId

    }

    def 'when author does not exist should throw exception'() {
        given:
        def workspaceId = TestUtils.workspaceId
        def workspace = TestUtils.workspace
        def authorization = TestUtils.authorization
        def hypothesisId = TestUtils.hypothesisId
        def tagName = 'charles-cd-build-testing'
        def featureList = getFeatureList();

        def hypothesis = getHypothesis(new ArrayList<Column>())

        def createBuildRequest = new CreateBuildRequest(featureList, tagName, hypothesisId)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        0 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        0 * hypothesisRepository.findById(hypothesis.id) >> Optional.of(hypothesis)
        1 * managementUserSecurityService.getUserEmail(authorization) >> "email@email.com"
        1 * userRepository.findByEmail("email@email.com") >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"

    }

    def 'should create build using authorization'() {

        def authorization = TestUtils.authorization
        def hypothesisId = TestUtils.hypothesisId
        def workspaceId = TestUtils.workspaceId
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')

        def author = TestUtils.user

        def todoCardColumn = getColumn(ColumnConstants.TO_DO_COLUMN_NAME)

        def doingCardColumn = getColumn(ColumnConstants.DOING_COLUMN_NAME)

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

        def buildsCardColumn = getColumn(ColumnConstants.BUILDS_COLUMN_NAME)

        def deployedReleasesCardColumn = getColumn(ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = getHypothesis(columns)

        def createBuildRequest = new CreateBuildRequest(featureList, tagName, hypothesis.id)

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def credentials = new GitCredentials("http://github.com.br", "zup", "zup@123",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("ab84b4df-879b-47b2-90d9-bf5a6708c39d", "GitHub",
                credentials, LocalDateTime.now(), author, "24d4f405-70e2-4908-8f66-f4951e46bc3b")

        when:
        def buildResponse = buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) >> Optional.of(hypothesis)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
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

    def 'should create build using system token'() {

        def systemTokenValue = TestUtils.systemTokenValue
        def systemTokenId = TestUtils.systemTokenId
        def hypothesisId = TestUtils.hypothesisId
        def workspaceId = TestUtils.workspaceId
        def tagName = 'charles-cd-build-testing'
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')

        def author = TestUtils.user

        def todoCardColumn = getColumn(ColumnConstants.TO_DO_COLUMN_NAME)

        def doingCardColumn = getColumn(ColumnConstants.DOING_COLUMN_NAME)

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

        def buildsCardColumn = getColumn(ColumnConstants.BUILDS_COLUMN_NAME)

        def deployedReleasesCardColumn = getColumn(ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = getHypothesis(columns)

        def createBuildRequest = new CreateBuildRequest(featureList, tagName, hypothesis.id)

        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", "833336cd-742c-4f62-9594-45ac0a1e807a",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        def credentials = new GitCredentials("http://github.com.br", "zup", "zup@123",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("ab84b4df-879b-47b2-90d9-bf5a6708c39d", "GitHub",
                credentials, LocalDateTime.now(), author, "24d4f405-70e2-4908-8f66-f4951e46bc3b")

        when:
        def buildResponse = buildInteractor.execute(createBuildRequest, workspaceId, null, systemTokenValue)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) >> Optional.of(hypothesis)
        1 * systemTokenRepository.getIdByTokenValue(systemTokenValue) >> systemTokenId
        1 * userRepository.findBySystemTokenId(systemTokenId) >> Optional.of(author)
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

        def authorization = TestUtils.authorization
        def workspaceId = TestUtils.workspaceId
        def tagName = 'charles-cd-build-testing'
        def featureList = getFeatureList();

        def author = TestUtils.user

        def todoCardColumn = getColumn(ColumnConstants.TO_DO_COLUMN_NAME)

        def doingCardColumn = getColumn(ColumnConstants.DOING_COLUMN_NAME)

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

        def readyToGoCardColumn = getColumn(ColumnConstants.READY_TO_GO_COLUMN_NAME)

        def buildsCardColumn = getColumn(ColumnConstants.BUILDS_COLUMN_NAME)

        def deployedReleasesCardColumn = getColumn(ColumnConstants.DEPLOYED_RELEASES_COLUMN_NAME)

        def columns = new ArrayList<Column>()
        columns.addAll(todoCardColumn, doingCardColumn, readyToGoCardColumn, buildsCardColumn, deployedReleasesCardColumn)

        def hypothesis = getHypothesis(columns)

        def createBuildRequest = new CreateBuildRequest(featureList, tagName, hypothesis.id)

        def workspace = TestUtils.workspace

        when:
        buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * hypothesisRepository.findByIdAndWorkspaceId(hypothesis.id, workspaceId) >> Optional.of(hypothesis)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)

        def exception = thrown(BusinessException)
        assert exception.message == "some.of.informed.features.does.not.exist.or.are.not.ready.to.go"
    }

    def 'should throw an exception where git is not configured in workspace'() {
        given:
        def authorization = TestUtils.authorization
        def workspaceId = TestUtils.workspaceId
        def author = TestUtils.user
        def createBuildRequest = new CreateBuildRequest(featureList, "tagName", "7a973eed-599b-428d-89f0-9ef6db8fd392")
        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "http://matcher-uri.com.br", null,
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)

        thrown(BusinessException)
    }

    def 'should throw an exception where registry is not configured in workspace'() {
        given:
        def authorization = TestUtils.authorization
        def workspaceId = TestUtils.workspaceId
        def author = TestUtils.user
        def createBuildRequest = new CreateBuildRequest(featureList, "tagName", "7a973eed-599b-428d-89f0-9ef6db8fd392")
        def workspace = new Workspace(workspaceId, "Women", author, LocalDateTime.now(), [],
                WorkspaceStatusEnum.COMPLETE, null,
                "http://matcher-uri.com.br", "7a973eed-599b-428d-89f0-9ef6db8fd39d",
                "c5147c49-1923-44c5-870a-78aaba646fe4", null)

        when:
        buildInteractor.execute(createBuildRequest, workspaceId, authorization, null)

        then:
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)

        thrown(BusinessException)
    }

    private static GitConfiguration getDummyGitConfiguration(User author, String workspaceId) {
        new GitConfiguration('68b04fa2-032c-4bdc-9228-6e2e8a5fb791', 'Git Config', getDummyGitCredentials(),
                LocalDateTime.now(), author, workspaceId)
    }

    private static GitCredentials getDummyGitCredentials() {
        new GitCredentials('Credential address', 'username',
                'password', 'Access Token', GitServiceProvider.GITHUB)
    }

    private static Label getDummyLabel(User author) {
        new Label('b803558d-3c70-4321-ace5-ae8317902c05', 'Label name', LocalDateTime.now(), author, '#FFFFFF')
    }

    private static ArrayList getFeatureList() {
        def featureList = new ArrayList()
        featureList.add('1f9e7e42-26c5-4aa3-9f94-6c98095ba4a2')
        featureList.add('5455be03-83be-4a7a-b725-52d51cc2430e')
        return featureList
    }

    private static Column getColumn(String status) {
        return new Column('2dd78ca0-6a2c-11ea-bc55-0242ac130003', status,
                TestUtils.hypothesisId, new ArrayList<Card>(), TestUtils.workspaceId)
    }

    private static Hypothesis getHypothesis(ArrayList<Column> collumns) {
        return new Hypothesis(TestUtils.hypothesisId, 'Hypothesis Name', 'Hypothesis Description', TestUtils.user,
                LocalDateTime.now(), collumns, new ArrayList<Build>(), TestUtils.workspaceId)
    }
}
