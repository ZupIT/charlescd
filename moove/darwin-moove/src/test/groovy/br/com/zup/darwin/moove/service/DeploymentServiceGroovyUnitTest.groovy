/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DeployApi
import br.com.zup.darwin.moove.api.response.*
import br.com.zup.darwin.moove.request.deployment.CreateDeploymentRequest
import br.com.zup.darwin.repository.BuildRepository
import br.com.zup.darwin.repository.CircleRepository
import br.com.zup.darwin.repository.DeploymentRepository
import br.com.zup.darwin.repository.UserRepository
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import spock.lang.Specification

import java.time.LocalDateTime

class DeploymentServiceGroovyUnitTest extends Specification {

    private String applicationId = "application-id"
    private DeploymentService service
    private JsonNode jsonNode = new ObjectMapper().createObjectNode()
    private DeploymentRepository deploymentRepository = Mock(DeploymentRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private BuildRepository buildRepository = Mock(BuildRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private DeployApi deployApi = Mock(DeployApi)
    private DarwinNotificationService darwinNotificationService = Mock(DarwinNotificationService)

    def setup() {
        this.service = new DeploymentService(deploymentRepository, userRepository, buildRepository, circleRepository, deployApi, darwinNotificationService,)
        this.service.MOOVE_BASE_PATH = "http://fake-moove/base-path"
    }

    def 'should create a new deployment with no active deployment on that circle (do not call undeploy)'() {

        given:

        def user = createUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis("hypothesis-a", user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)
        def circle = createCircle(user, "developer")
        def deployment = createDeployment(user, circle, build, LocalDateTime.now())
        def deployCircleResponse = createDeployCircleResponse()
        def deployComponentResponse = createDeployComponentResponse()
        def deployModuleResponse = createDeployModuleResponse(deployComponentResponse)
        def deployResponse = createDeployResponse(deployModuleResponse, deployCircleResponse)

        def request = new CreateDeploymentRequest("user-id", "circle-id", "build-id")

        when:
        def representation = this.service.createDeployment(request, applicationId)

        then:

        1 * buildRepository.findByIdAndApplicationId(request.buildId, applicationId) >> Optional.ofNullable(build)
        1 * buildRepository.findById(request.buildId) >> Optional.ofNullable(build)
        1 * circleRepository.findById(circle.id) >> Optional.ofNullable(circle)
        1 * userRepository.findById(request.authorId) >> Optional.ofNullable(user)
        1 * deploymentRepository.findByCircleIdAndApplicationId(circle.id, applicationId) >> Collections.emptyList()
        0 * deployApi.undeploy(_)
        1 * deploymentRepository.save(_) >> deployment
        1 * deployApi.deployInSegmentedCircle(_) >> deployResponse
        1 * darwinNotificationService.createDeployment(deployment)

        assert representation != null
        assert representation.id == deployment.id
        assert representation.author.id == user.id
        assert representation.build != null
        assert representation.circle != null

        notThrown()

    }

    def 'should create a new deployment with active deployment on that circle (call undeploy)'() {

        given:

        def user = createUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis("hypothesis-a", user, problem)
        def secondHypothesis = createHypothesis("hypothesis-b", user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)
        def activeBuild = createBuild(user, feature, secondHypothesis, column)
        def circle = createCircle(user, "developer")
        def deployment = createDeployment(user, circle, build, LocalDateTime.now())
        def firstActiveDeployment = createDeployment(user, circle, activeBuild, LocalDateTime.now().minusDays(1))
        def secondFirstActiveDeployment = createDeployment(user, circle, activeBuild, LocalDateTime.now().minusDays(2))
        def deployCircleResponse = createDeployCircleResponse()
        def deployComponentResponse = createDeployComponentResponse()
        def deployModuleResponse = createDeployModuleResponse(deployComponentResponse)
        def deployResponse = createDeployResponse(deployModuleResponse, deployCircleResponse)
        def undeployResponse = new UndeployResponse(firstActiveDeployment.id)

        def request = new CreateDeploymentRequest("user-id", "circle-id", "build-id")

        when:
        def representation = this.service.createDeployment(request, applicationId)

        then:

        1 * buildRepository.findByIdAndApplicationId(request.buildId, applicationId) >> Optional.ofNullable(build)
        1 * buildRepository.findById(request.buildId) >> Optional.ofNullable(build)
        1 * circleRepository.findById(circle.id) >> Optional.ofNullable(circle)
        1 * userRepository.findById(request.authorId) >> Optional.ofNullable(user)
        1 * deploymentRepository.findByCircleIdAndApplicationId(circle.id, applicationId) >> Arrays.asList(secondFirstActiveDeployment, firstActiveDeployment)
        1 * deployApi.undeploy(firstActiveDeployment.id, _) >> undeployResponse
        1 * deploymentRepository.save(_) >> firstActiveDeployment
        1 * deploymentRepository.save(_) >> deployment
        1 * deployApi.deployInSegmentedCircle(_) >> deployResponse
        1 * darwinNotificationService.createDeployment(deployment)

        assert representation != null
        assert representation.id == deployment.id
        assert representation.author.id == user.id
        assert representation.build != null
        assert representation.circle != null

        notThrown()

    }

    def 'should create a new deployment with no active deployment on default circle (do not call undeploy)'() {

        given:

        def user = createUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis("hypothesis-a", user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)
        def circle = createCircle(user, MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME)
        def deployment = createDeployment(user, circle, build, LocalDateTime.now())
        def deployCircleResponse = createDeployCircleResponse()
        def deployComponentResponse = createDeployComponentResponse()
        def deployModuleResponse = createDeployModuleResponse(deployComponentResponse)
        def deployResponse = createDeployResponse(deployModuleResponse, deployCircleResponse)

        def request = new CreateDeploymentRequest("user-id", "circle-id", "build-id")

        when:
        def representation = this.service.createDeployment(request, applicationId)

        then:

        1 * buildRepository.findByIdAndApplicationId(request.buildId, applicationId) >> Optional.ofNullable(build)
        1 * buildRepository.findById(request.buildId) >> Optional.ofNullable(build)
        1 * circleRepository.findById(circle.id) >> Optional.ofNullable(circle)
        1 * userRepository.findById(request.authorId) >> Optional.ofNullable(user)
        1 * deploymentRepository.findByCircleIdAndApplicationId(circle.id, applicationId) >> Collections.emptyList()
        0 * deployApi.undeploy(_)
        1 * deploymentRepository.save(_) >> deployment
        1 * deployApi.deployInDefaultCircle(_) >> deployResponse
        1 * darwinNotificationService.createDeployment(deployment)

        assert representation != null
        assert representation.id == deployment.id
        assert representation.author.id == user.id
        assert representation.build != null
        assert representation.circle != null

        notThrown()

    }

    def 'should create a new deployment with active deployments on default circle (do not call undeploy)'() {

        given:

        def user = createUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis("hypothesis-a", user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)
        def circle = createCircle(user, MooveConstants.MOOVE_DEFAULT_CIRCLE_NAME)
        def deployment = createDeployment(user, circle, build, LocalDateTime.now())
        def deployCircleResponse = createDeployCircleResponse()
        def deployComponentResponse = createDeployComponentResponse()
        def deployModuleResponse = createDeployModuleResponse(deployComponentResponse)
        def deployResponse = createDeployResponse(deployModuleResponse, deployCircleResponse)

        def request = new CreateDeploymentRequest("user-id", "circle-id", "build-id")

        when:
        def representation = this.service.createDeployment(request, applicationId)

        then:

        1 * buildRepository.findByIdAndApplicationId(request.buildId, applicationId) >> Optional.ofNullable(build)
        1 * buildRepository.findById(request.buildId) >> Optional.ofNullable(build)
        1 * circleRepository.findById(circle.id) >> Optional.ofNullable(circle)
        1 * userRepository.findById(request.authorId) >> Optional.ofNullable(user)
        1 * deploymentRepository.findByCircleIdAndApplicationId(circle.id, applicationId) >> Collections.emptyList()
        0 * deployApi.undeploy(_)
        1 * deploymentRepository.save(_) >> deployment
        1 * deployApi.deployInDefaultCircle(_) >> deployResponse
        1 * darwinNotificationService.createDeployment(deployment)

        assert representation != null
        assert representation.id == deployment.id
        assert representation.author.id == user.id
        assert representation.build != null
        assert representation.circle != null

        notThrown()

    }

    def 'should create a new deployment with Darwin value flow id'() {

        given:

        def user = createUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis("hypothesis-a", user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, null, column)
        def circle = createCircle(user, "developer")
        def deployment = createDeployment(user, circle, build, LocalDateTime.now())
        def deployCircleResponse = createDeployCircleResponse()
        def deployComponentResponse = createDeployComponentResponse()
        def deployModuleResponse = createDeployModuleResponse(deployComponentResponse)
        def deployResponse = createDeployResponse(deployModuleResponse, deployCircleResponse)

        def request = new CreateDeploymentRequest("user-id", "circle-id", "build-id")

        when:
        def representation = this.service.createDeployment(request, applicationId)

        then:

        1 * buildRepository.findByIdAndApplicationId(request.buildId,applicationId) >> Optional.ofNullable(build)
        1 * buildRepository.findById(request.buildId) >> Optional.ofNullable(build)
        1 * circleRepository.findById(circle.id) >> Optional.ofNullable(circle)
        1 * userRepository.findById(request.authorId) >> Optional.ofNullable(user)
        1 * deploymentRepository.findByCircleIdAndApplicationId(circle.id, applicationId) >> Collections.emptyList()
        1 * deploymentRepository.save(_) >> deployment
        1 * deployApi.deployInSegmentedCircle(_) >> deployResponse
        1 * darwinNotificationService.createDeployment(deployment)

        assert representation != null
        assert representation.id == deployment.id
        assert representation.author.id == user.id
        assert representation.build != null
        assert representation.circle != null

        notThrown()

    }

    def 'should do the undeploy of a release'() {

        given:
        User user = new User(
                "user-id",
                "zup-user",
                "zup-user@zup.com.br",
                "http://zup-user.com/user.jpg",
                [],
                LocalDateTime.now()
        )
        Problem problem = createProblem(user)
        Hypothesis hypothesis = createHypothesis("hypothesis-a", user, problem)

        CardColumn cardColumn = new CardColumn("card-column-id", "card-column-name", hypothesis, "application-id")

        Build build = new Build("build-id",
                user,
                LocalDateTime.now(),
                [],
                "build-tag",
                null,
                cardColumn,
                BuildStatus.BUILT,
                applicationId,
                [],
                [])

        Circle circle = new Circle("circle-id",
                "woman",
                "reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                this.jsonNode,
                1000, LocalDateTime.now())

        Deployment deployment = new Deployment("deployment-id",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatus.DEPLOYED,
                circle,
                build,
                applicationId
        )

        Deployment updatedDeployment = new Deployment("deployment-id",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatus.UNDEPLOYING,
                circle,
                build,
                applicationId)

        when:
        this.service.undeploy("deployment-id", applicationId)

        then:
        this.deploymentRepository.findByIdAndApplicationId(_, _) >> Optional.ofNullable(deployment)
        this.deploymentRepository.save(_) >> updatedDeployment
        this.deployApi.undeploy(_, _) >> new UndeployResponse("deployment-id")

    }

    private DeployResponse createDeployResponse(DeployModuleResponse deployModuleResponse, DeployCircleResponse deployCircleResponse) {
        new DeployResponse("deploy-r-id",
                [deployModuleResponse],
                "http://uri.com.br/callback",
                "vf-id",
                deployCircleResponse,
                false,
                "user-id",
                "DEPLOYED",
                LocalDateTime.now()
        )
    }

    private DeployModuleResponse createDeployModuleResponse(DeployComponentResponse deployComponentResponse) {
        new DeployModuleResponse("dm-id",
                "module-id",
                [deployComponentResponse],
                "FINISHED",
                LocalDateTime.now()
        )
    }

    private DeployComponentResponse createDeployComponentResponse() {
        new DeployComponentResponse("dc-id",
                "component-id",
                "component-name",
                "registry/image",
                "b-image-tag",
                "/context-path",
                "/health-check",
                8080,
                "FINISHED",
                LocalDateTime.now()
        )
    }

    private DeployCircleResponse createDeployCircleResponse() {
        new DeployCircleResponse(
                "abcdefghij",
                true
        )
    }

    private Build createBuild(User user, Feature feature, Hypothesis hypothesis, CardColumn column) {
        new Build("build-id",
                user,
                LocalDateTime.now(),
                [feature],
                "build-tag",
                hypothesis,
                column,
                BuildStatus.BUILT,
                "application-id",
                [],
                []
        )
    }

    private Deployment createDeployment(User user, Circle circle, Build build, LocalDateTime createdAt) {
        new Deployment("deployment-id",
                user,
                createdAt,
                LocalDateTime.now(),
                DeploymentStatus.DEPLOYED,
                circle,
                build,
                "application-id"
        )
    }

    private Circle createCircle(User user, String name) {
        new Circle("circle-id",
                name,
                "reference",
                user,
                LocalDateTime.now(),
                MatcherType.SIMPLE_KV,
                jsonNode,
                1000,
                LocalDateTime.now()
        )
    }

    private Comment createComment(User user) {
        new Comment("comment-id",
                user,
                LocalDateTime.now(),
                "Fake comment"
        )
    }

    private SoftwareCard createCard(CardColumn column, User user, Feature feature, Hypothesis hypothesis) {
        new SoftwareCard("card-id",
                "card-name",
                "description",
                column,
                SoftwareCardType.FEATURE,
                user,
                LocalDateTime.now(),
                feature,
                [],
                [],
                hypothesis,
                CardStatus.ACTIVE,
                [],
                0,
                "application-id")
    }

    private Feature createFeature(User user) {
        return new Feature("feature-id",
                "feature-name",
                "feature-branch-name",
                user,
                LocalDateTime.now(),
                [],
                "application-id")
    }

    private CardColumn createCardColumn(Hypothesis hypothesis) {
        new CardColumn("column-id",
                "column-name",
                hypothesis,
                "application-id")
    }

    private Hypothesis createHypothesis(String hypothesisId, User user, Problem problem) {
        new Hypothesis(
                hypothesisId,
                "hyp-name",
                "hyp-description",
                user,
                LocalDateTime.now(),
                problem,
                [],
                [],
                [],
                [],
                "application-id"
        )
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

    private User createUser() {
        new User(
                "user-id",
                "user-name",
                "user@zup.com.br",
                "http://user.com.br/photo.jpg",
                [],
                LocalDateTime.now()
        )
    }
}
