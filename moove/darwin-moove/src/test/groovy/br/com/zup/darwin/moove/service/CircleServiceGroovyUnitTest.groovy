/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.request.NodeRequest
import br.com.zup.darwin.moove.api.response.NodeRepresentation
import br.com.zup.darwin.moove.request.circle.CreateCircleRequest
import br.com.zup.darwin.moove.request.circle.UpdateCircleRequest
import br.com.zup.darwin.moove.service.circle.CircleMatcher
import br.com.zup.darwin.moove.service.circle.DarwinCircleMatcher
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.darwin.repository.DeploymentRepository
import br.com.zup.darwin.repository.KeyValueRuleRepository
import br.com.zup.darwin.repository.UserRepository
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

import java.time.LocalDateTime
import java.time.Month

class CircleServiceGroovyUnitTest extends Specification {

    private CircleService circleService
    private JsonNode jsonNode = new ObjectMapper().createObjectNode()
    private DarwinCircleMatcher darwinCircleMatcher = Mock(DarwinCircleMatcher)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private ObjectMapper objectMapper = Mock(ObjectMapper)
    private CircleMatcher circleMatcher = Mock(CircleMatcher)
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private KeyValueRuleRepository keyValueRuleRepository = Mock(KeyValueRuleRepository)
    private MultipartFile multipartFile = Mock(MultipartFile)

    def setup() {
        this.circleService = new CircleService(circleRepository,
                userRepository,
                circleMatcher,
                keyValueRuleRepository,
                deploymentRepository,
                objectMapper)

    }

    def 'should not show any  component from older deploy'() {
        def deployments = new ArrayList()
        def user = createUser()
        def circle = new Circle("circle-id",
                MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME,
                "circle-reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                this.jsonNode,
                1000,
                LocalDateTime.now())
        def date1 = LocalDateTime.of(2019, Month.MARCH, 3, 0, 0, 0, 0)
        def date2 = LocalDateTime.of(2020, Month.MARCH, 25, 0, 0, 0, 0)
        def hypothesis = createHypothesis(user, createProblem(user), circle)


        def credentials = new GitCredentials("http://github.com.br/zup", "zup", "zup@123", null, GitServiceProvider.GITHUB)
        def configuration = new GitConfiguration("config-id", "config", LocalDateTime.of(2019, 12, 1, 0, 0), user, "application-id", credentials)
        def module = new Module("module-id", "module", "gitRepositoryAddress", LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", user, [], [], "application-id", configuration, "cdConfigId", "registryConfigId")

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")
        def build1 = createBuild(user, hypothesis, column)
        def component = new Component(
                "component-id",
                "component-name",
                "component-context",
                8081,
                "darwin-demo/health",
                LocalDateTime.now(),
                module,
                [],
                "applicationId"
        )
        def component1 = new Component(
                "component-id2",
                "component-application",
                "component-context",
                8081,
                "darwin-demo/health",
                LocalDateTime.now(),
                module,
                [],
                "applicationId"
        )
        def oldArtifact = createArtifact("artifact-id", "artifact-name", "artifact-version", LocalDateTime.now(), build1, component)
        def oldArtifact1 = createArtifact("artifact-id2", "artifact-name2", "artifact-version", LocalDateTime.now(), build1, component1)
        def newArtifact = createArtifact("artifact-id3", "artifact-name3", "artifact-version", LocalDateTime.now(), build1, component)
        def newArtifact1 = createArtifact("artifact-id4", "artifact-name4", "artifact-version", LocalDateTime.now(), build1, component1)
        def oldBuild = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                [oldArtifact, oldArtifact1]
        )
        def newBuild = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                [newArtifact, newArtifact1]
        )
        def oldDeployment = new Deployment("that-id",
                user,
                date1,
                date1,
                DeploymentStatus.DEPLOYED,
                circle,
                oldBuild,
                "application-id"
        )
        def newDeployment = new Deployment("my-id",
                user,
                date2,
                date2,
                DeploymentStatus.DEPLOYED,
                circle,
                newBuild,
                "application-id"
        )

        deployments.add(oldDeployment)
        deployments.add(newDeployment)

        when:

        def response = circleService.filterCurrentDeploymentArtifacts(circle)
        then:
        deploymentRepository.findByCircleId(_) >> deployments
        assert response.deployment.artifacts.size() == 2
        assert response.deployment.build.id == newDeployment.build.id
        assert response.deployment.artifacts[0].artifact == newDeployment.build.artifacts[0].artifact
        assert response.deployment.artifacts[1].artifact == newDeployment.build.artifacts[1].artifact

        assert response != null


    }

    def 'should not show a older component from deploy'() {
        def deployments = new ArrayList()
        def user = createUser()
        def circle = new Circle("circle-id",
                MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME,
                "circle-reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                this.jsonNode,
                1000,
                LocalDateTime.now())
        def date1 = LocalDateTime.of(2019, Month.MARCH, 3, 0, 0, 0, 0)
        def date2 = LocalDateTime.of(2020, Month.MARCH, 25, 0, 0, 0, 0)
        def hypothesis = createHypothesis(user, createProblem(user), circle)

        def credentials = new GitCredentials("http://github.com.br/zup", "zup", "zup@123", null, GitServiceProvider.GITHUB)
        def configuration = new GitConfiguration("config-id", "config", LocalDateTime.of(2019, 12, 1, 0, 0), user, "application-id", credentials)
        def module = new Module("module-id", "module", "gitRepositoryAddress", LocalDateTime.of(2019, 12, 1, 0, 0), "helm-repository", user, [], [], "application-id", configuration, "cdConfigId", "registryConfigId")
        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")
        def build1 = createBuild(user, hypothesis, column)
        def component = new Component(
                "component-id",
                "component-name",
                "component-context",
                8081,
                "darwin-demo/health",
                LocalDateTime.now(),
                module,
                [],
                "applicationId"
        )
        def component1 = new Component(
                "component-id2",
                "component-application",
                "component-context",
                8081,
                "darwin-demo/health",
                LocalDateTime.now(),
                module,
                [],
                "applicationId"
        )
        def oldArtifact = createArtifact("artifact-id", "artifact-name", "artifact-version", LocalDateTime.now(), build1, component)
        def oldArtifact1 = createArtifact("artifact-id2", "artifact-name2", "artifact-version", LocalDateTime.now(), build1, component1)
        def newArtifact = createArtifact("artifact-id3", "artifact-name3", "artifact-version", LocalDateTime.now(), build1, component)
        def oldBuild = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                [oldArtifact, oldArtifact1]
        )
        def newBuild = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                [newArtifact]
        )
        def oldDeployment = new Deployment("that-id",
                user,
                date1,
                date1,
                DeploymentStatus.DEPLOYED,
                circle,
                oldBuild,
                "application-id"
        )
        def newDeployment = new Deployment("my-id",
                user,
                date2,
                date2,
                DeploymentStatus.DEPLOYED,
                circle,
                newBuild,
                "application-id"
        )

        deployments.add(oldDeployment)
        deployments.add(newDeployment)

        when:

        def response = circleService.filterCurrentDeploymentArtifacts(circle)
        then:
        1 * deploymentRepository.findByCircleId(_) >> deployments
        assert response.deployment.artifacts.size() == 2
        assert response.deployment.artifacts[0].artifact == newDeployment.build.artifacts[0].artifact
        assert response.deployment.artifacts[1].artifact == oldDeployment.build.artifacts[1].artifact
        assert response != null


    }

    def 'should create a new circle with csv file'() {

        given:
        def author = createUser()
        def circle = createCricle(author)

        def problem = createProblem(author)
        def hypothesis = createHypothesis(author, problem, circle)
        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")
        def build = createBuild(author, hypothesis, column)
        def deployment = createDeployment(author, circle, build, DeploymentStatus.DEPLOYED)

        def deployments = new ArrayList()
        deployments.add(deployment)

        def keyValueRule1 = new KeyValueRule("kv-id-1", this.jsonNode, circle)
        def keyValueRule2 = new KeyValueRule("kv-id-2", this.jsonNode, circle)
        def keyValueRule3 = new KeyValueRule("kv-id-3", this.jsonNode, circle)
        def keyValueRule4 = new KeyValueRule("kv-id-4", this.jsonNode, circle)
        def keyValueRule5 = new KeyValueRule("kv-id-5", this.jsonNode, circle)

        def rules = new ArrayList()

        rules.add(keyValueRule1)
        rules.add(keyValueRule2)
        rules.add(keyValueRule3)
        rules.add(keyValueRule4)
        rules.add(keyValueRule5)

        def fileContent = "IDs\n" +
                "ce532f07-3bcf-40f8-9a39-289fb527ed54\n" +
                "c4b13c9f-d151-4f68-aad5-313b08503bd6\n" +
                "d77c5d16-a39f-406e-a33b-cee986b82348\n" +
                "2dd5fd08-c23a-494a-80b6-66db39c73630\n"

        def inputStream = new ByteArrayInputStream(fileContent.getBytes())

        when:

        def response = circleService.createWithCsv("user-name", "author-id", "IDs", this.multipartFile)

        then:

        assert response != null
        assert response.id == "circle-id"
        assert response.name == "woman"

        1 * this.userRepository.findById(_) >> Optional.of(author)
        3 * this.circleRepository.save(_) >> circle
        2 * this.multipartFile.inputStream >> inputStream
        1 * this.keyValueRuleRepository.saveAll(_) >> rules
        1 * this.deploymentRepository.findByCircleId(_) >> deployments
    }

    def 'should update a circle with csv file'() {

        given:
        def author = createUser()
        def circle = createCricle(author)

        def problem = createProblem(author)
        def hypothesis = createHypothesis(author, problem, circle)
        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")
        def build = createBuild(author, hypothesis, column)
        def deployment = createDeployment(author, circle, build, DeploymentStatus.DEPLOYED)

        def deployments = new ArrayList()
        deployments.add(deployment)

        def keyValueRule1 = new KeyValueRule("kv-id-1", this.jsonNode, circle)
        def keyValueRule2 = new KeyValueRule("kv-id-2", this.jsonNode, circle)
        def keyValueRule3 = new KeyValueRule("kv-id-3", this.jsonNode, circle)
        def keyValueRule4 = new KeyValueRule("kv-id-4", this.jsonNode, circle)
        def keyValueRule5 = new KeyValueRule("kv-id-5", this.jsonNode, circle)

        def rules = new ArrayList()

        rules.add(keyValueRule1)
        rules.add(keyValueRule2)
        rules.add(keyValueRule3)
        rules.add(keyValueRule4)
        rules.add(keyValueRule5)

        def fileContent = "IDs\n" +
                "ce532f07-3bcf-40f8-9a39-289fb527ed54\n" +
                "c4b13c9f-d151-4f68-aad5-313b08503bd6\n" +
                "d77c5d16-a39f-406e-a33b-cee986b82348\n" +
                "2dd5fd08-c23a-494a-80b6-66db39c73630\n"

        def inputStream = new ByteArrayInputStream(fileContent.getBytes())

        when:

        def response = circleService.updateWithCsv("circle-id", "circle-name", "IDs", multipartFile)

        then:

        assert response != null
        assert response.id == "circle-id"
        assert response.name == "woman"

        1 * this.circleRepository.findById(_) >> Optional.of(circle)
        4 * this.circleRepository.save(_) >> circle
        2 * this.multipartFile.inputStream >> inputStream
        1 * this.keyValueRuleRepository.saveAll(_) >> rules
        1 * this.deploymentRepository.findByCircleId(_) >> deployments
    }


    def 'should find a circle by id'() {
        given:

        def user = createUser()

        def circle = createCricle(user)

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        def secondDeployment = new Deployment("that-id",
                user,
                LocalDateTime.of(2019, 3, 3, 0, 0, 0, 0),
                LocalDateTime.of(2019, 3, 3, 0, 0, 0, 0),
                DeploymentStatus.DEPLOYED,
                circle,
                build,
                "application-id"
        )

        List<Deployment> deployments = new ArrayList<>()
        deployments.add(deployment)
        deployments.add(secondDeployment)
        when:
        def response = this.circleService.findById("circle-id")

        then:
        this.circleRepository.findById(_ as String) >> Optional.ofNullable(circle)
        this.deploymentRepository.findByCircleId(_ as String) >> deployments

        assert response.id == "circle-id"
        assert response.name == "woman"
        assert response.deployment.artifacts.isEmpty()

        notThrown()
    }

    def 'should delete a circle by id'() {
        given:
        List<JsonNode> nodes = new ArrayList<>()
        nodes.add(this.jsonNode)

        User user = new User(
                "user-id",
                "zup-user",
                "zup-user@zup.com.br",
                "http://zup-user.com/user.jpg",
                [],
                LocalDateTime.now()
        )

        Circle circle = new Circle("circle-id",
                "woman",
                "fake-cricle-reference",
                user,
                LocalDateTime.now(),
                MatcherType.REGULAR,
                this.jsonNode,
                1000,
                LocalDateTime.now())

        when:
        this.circleService.delete("circle-id")

        then:
        this.circleRepository.findById(_ as String) >> Optional.ofNullable(circle)

        notThrown()
    }

    def 'should find all active circles filtering by name'() {

        given:

        def user = createUser()

        def circle = createCricle(user)

        def name = "wom"

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        List<Deployment> deployments = new ArrayList<Deployment>() {
            {
                add(deployment)
            }
        }

        Pageable pageable = new PageRequest(0, 1)

        when:
        def response = this.circleService.findAll(name, true, pageable)

        then:
        1 * circleRepository.findActiveCirclesByName(name, pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        1 * deploymentRepository.findByCircleId(circle.id) >> deployments
        0 * _

        assert response.size == 1
        assert response.content[0].id == circle.id
        assert response.content[0].name == circle.name
        assert response.content[0].deployment != null

        notThrown()

    }

    def 'should find all active circles filtering by name with multiple deployments'() {

        given:

        def user = createUser()

        def circle = createCricle(user)

        def name = "wom"

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        def otherDeployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        List<Deployment> deployments = new ArrayList<Deployment>() {
            {
                add(deployment)
            }
        }

        deployments.add(otherDeployment)

        Pageable pageable = new PageRequest(0, 1)

        when:
        def response = this.circleService.findAllWithAllDeployments(name, true, pageable)

        then:
        1 * circleRepository.findActiveCirclesByName(name, pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        1 * deploymentRepository.findByCircleId(circle.id) >> deployments
        0 * _

        assert response.size == 1
        assert response.content[0].id == circle.id
        assert response.content[0].name == circle.name
        assert response.content[0].deployments.size() == 2

        notThrown()

    }

    def 'should find all active circles'() {

        given:

        def user = createUser()

        def circle = createCricle(user)

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "app-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        List<Deployment> deployments = new ArrayList<Deployment>() {
            {
                add(deployment)
            }
        }

        Pageable pageable = new PageRequest(0, 1)

        when:
        def response = this.circleService.findAll(null, true, pageable)

        then:
        1 * circleRepository.findActiveCircles(pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        1 * deploymentRepository.findByCircleId(circle.id) >> deployments
        0 * _

        assert response.size == 1
        assert response.content[0].id == circle.id
        assert response.content[0].name == circle.name
        assert response.content[0].deployment != null

        notThrown()

    }

    def 'should find all inactive circles filtering by name '() {

        given:

        def user = createUser()

        def circle = createCricle(user)

        def name = "wom"

        Pageable pageable = new PageRequest(0, 1)

        when:
        def response = this.circleService.findAll(name, false, pageable)

        then:
        1 * circleRepository.findInactiveCirclesByName(name, pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        0 * _

        assert response.size == 1
        assert response.content[0].id == circle.id
        assert response.content[0].name == circle.name
        assert response.content[0].deployment == null

        notThrown()
    }

    def 'should find all inactive circles'() {

        given:

        def user = createUser()

        def circle = createCricle(user)

        Pageable pageable = new PageRequest(0, 1)

        when:
        def response = this.circleService.findAll(null, false, pageable)
        def responseAllDeployments = this.circleService.findAllWithAllDeployments(null, false, pageable)

        then:
        1 * circleRepository.findInactiveCircles(pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        1 * circleRepository.findInactiveCircles(pageable) >> new PageImpl(new ArrayList<Circle>() {
            {
                add(circle)
            }
        }, pageable, 1)
        0 * _

        assert response.size == 1
        assert response.content[0].id == circle.id
        assert response.content[0].name == circle.name
        assert response.content[0].deployment == null

        assert responseAllDeployments.size == 1
        assert responseAllDeployments.content[0].id == circle.id
        assert responseAllDeployments.content[0].name == circle.name
        assert responseAllDeployments.content[0].deployments == []

        notThrown()

    }

    def 'should not find any active circle filtering by name'() {

        given:

        Pageable pageable = Mock(PageRequest)

        def name = "not-found"

        when:
        def response = this.circleService.findAll(name, true, pageable)

        then:
        1 * circleRepository.findActiveCirclesByName(name, pageable) >> new PageImpl(Collections.emptyList())
        0 * _

        assert response.size == 0
        assert response.content.size() == 0

        notThrown()
    }

    def 'should not find any inactive circle filtering by name'() {

        given:
        Pageable pageable = Mock(PageRequest)

        def name = "not-found"

        when:
        def response = this.circleService.findAll(name, false, pageable)

        then:
        1 * circleRepository.findInactiveCirclesByName(name, pageable) >> new PageImpl(Collections.emptyList())
        0 * _

        assert response.size == 0
        assert response.content.size() == 0

        notThrown()
    }

    def 'should not find any active circle'() {

        given:

        Pageable pageable = Mock(PageRequest)

        when:
        def response = this.circleService.findAll(null, true, pageable)

        then:
        1 * circleRepository.findActiveCircles(pageable) >> new PageImpl(Collections.emptyList())
        0 * _

        assert response.size == 0

        notThrown()
    }

    def 'should not find any inactive circle'() {

        given:

        Pageable pageable = Mock(PageRequest)

        when:
        def response = this.circleService.findAll(null, false, pageable)

        then:
        1 * circleRepository.findInactiveCircles(pageable) >> new PageImpl(Collections.emptyList())
        0 * _

        assert response.size == 0

        notThrown()
    }

    def 'should create a new circle'() {

        given:
        List<JsonNode> nodes = new ArrayList<>()
        nodes.add(this.jsonNode)

        def requestNode = createRequestNode()

        def responseNode = createResponseNode()

        NodeRepresentation representation = new NodeRepresentation("woman", responseNode, "node-id")

        def user = createUser()

        def circle = createCricle(user)

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        List<Deployment> deployments = new ArrayList<>()
        deployments.add(deployment)

        CreateCircleRequest request = new CreateCircleRequest("woman", "author-id", requestNode)

        when:
        def response = this.circleService.create(request)

        then:
        this.circleRepository.save(_) >> circle
        this.darwinCircleMatcher.create(_, _) >> representation
        this.userRepository.findById(_) >> Optional.ofNullable(user)
        this.deploymentRepository.findByCircleId(_) >> deployments

        assert response.name == "woman"
        assert response.id == "circle-id"
        assert response.author.id == response.author.id
        assert response.author.name == response.author.name

        notThrown()
    }

    def 'should update a circle'() {

        given:
        List<JsonNode> nodes = new ArrayList<>()
        nodes.add(this.jsonNode)

        def requestNode = createRequestNode()

        def responseNode = createResponseNode()

        NodeRepresentation representation = new NodeRepresentation("woman", responseNode, "node-id")

        def user = createUser()

        def circle = createCricle(user)

        def problem = createProblem(user)

        def hypothesis = createHypothesis(user, problem, circle)

        def column = new CardColumn("cc-id", "TODO", hypothesis, "application-id")

        def build = createBuild(user, hypothesis, column)

        def deployment = createDeployment(user, circle, build, DeploymentStatus.DEPLOYED)

        List<Deployment> deployments = new ArrayList<>()
        deployments.add(deployment)

        UpdateCircleRequest request = new UpdateCircleRequest("woman", requestNode)

        when:
        def response = this.circleService.update("circle-id", request)

        then:
        this.circleRepository.findById(_) >> Optional.ofNullable(circle)
        this.circleRepository.save(_) >> circle
        this.circleMatcher.get(MatcherType.SIMPLE_KV) >> this.darwinCircleMatcher
        this.darwinCircleMatcher.update(_, _, _) >> representation
        this.userRepository.findById(_) >> Optional.ofNullable(user)
        this.deploymentRepository.findByCircleId(_) >> deployments

        assert response.name == "woman"
        assert response.id == "circle-id"
        assert response.author.id == response.author.id
        assert response.author.name == response.author.name

        notThrown()

    }

    private Deployment createDeployment(User user, Circle circle, Build build, DeploymentStatus status) {
        new Deployment("deployment-id",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                status,
                circle,
                build,
                "application-id"
        )
    }

    private Artifact createArtifact(id, artifact, version, createdAt, build, component) {
        return new Artifact(id, artifact, version, createdAt, build, component)
    }

    private User createUser() {
        new User(
                "user-id",
                "zup-user",
                "zup-user@zup.com.br",
                "http://zup-user.com/user.jpg",
                [],
                LocalDateTime.now()
        )
    }

    private Circle createCricle(User user) {
        new Circle("circle-id",
                "woman",
                "circle-reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                this.jsonNode,
                1000,
                LocalDateTime.now())
    }

    private Problem createProblem(User user) {
        new Problem("problem-id",
                "problem-name",
                LocalDateTime.now(),
                user,
                "problem-description",
                [],
                "application-id")
    }

    private Hypothesis createHypothesis(User user, Problem problem, Circle circle) {
        new Hypothesis("hyp-id",
                "hyp-name",
                "hyp-description",
                user,
                LocalDateTime.now(),
                problem,
                [],
                [],
                [],
                [circle],
                "application-id"
        )
    }

    private Build createBuild(User user, Hypothesis hypothesis, CardColumn column) {
        new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                []
        )
    }

    private NodeRequest.Node createRequestNode() {
        new NodeRequest.Node(NodeRequest.Node.NodeTypeRequest.CLAUSE,
                NodeRequest.Node.LogicalOperatorRequest.AND,
                [],
                new NodeRequest.Node.RuleRequest("key", "condition", [])
        )
    }

    private NodeRepresentation.Node createResponseNode() {
        new NodeRepresentation.Node("node-type",
                "AND",
                [],
                new NodeRepresentation.Node.Rule("key", "condition", [])
        )
    }

}
