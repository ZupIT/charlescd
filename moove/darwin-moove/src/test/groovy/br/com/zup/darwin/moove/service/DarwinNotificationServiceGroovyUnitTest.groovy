/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DarwinNotificationApi
import br.com.zup.darwin.moove.api.request.NotificationProperties
import br.com.zup.darwin.repository.UserRepository
import com.fasterxml.jackson.databind.JsonNode
import org.springframework.cloud.context.environment.EnvironmentManager
import spock.lang.Specification

import java.time.LocalDateTime

class DarwinNotificationServiceGroovyUnitTest extends Specification {

    private DarwinNotificationService darwinNotificationService
    private UserRepository userRepository = Mock(UserRepository)
    private DarwinNotificationApi darwinNotificationApi = Mock(DarwinNotificationApi)
    private JsonNode jsonNode = Mock(JsonNode)
    private EnvironmentManager environmentManager = Mock(EnvironmentManager)

    def setup() {
        this.darwinNotificationService = new DarwinNotificationService(
                darwinNotificationApi,
                userRepository,
                environmentManager
        )
    }

    def 'should notify add members card event'() {

        given:

        def user = createDefaultUser()
        def anotherUser = new User(
                "another-user-id",
                "another-user-name",
                "another-user@zup.com.br",
                "http://another-user.com.br/photo.jpg",
                [],
                LocalDateTime.now()
        )

        def authorUser = new User(
                "author-user-id",
                "author-user-name",
                "author-user@zup.com.br",
                "http://author-user.com.br/photo.jpg",
                [],
                LocalDateTime.now()
        )

        def problem = createProblem(user)
        def hypothesis = createHypothesis(user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def card = createCard(column, user, feature, hypothesis)
        def membersIds = ["member-id-1", "member-id-2", "member-id-3"]

        def set = new HashSet<User>()
        set.add(anotherUser)

        card.addUsers(set)

        when:

        this.darwinNotificationService.addMembersCard(card, authorUser, membersIds)

        then:

        1 * this.darwinNotificationApi.create(_)
        1 * this.userRepository.findById("another-user-id") >> Optional.ofNullable(anotherUser)
        1 * this.environmentManager.getProperty(NotificationProperties.ADD_MEMBER_CARD.title) >> "ADD_MEMBER_TITLE"
        1 * this.environmentManager.getProperty(NotificationProperties.ADD_MEMBER_CARD.content) >> "ADD_MEMBER_CONTENT"

        notThrown()

    }

    def 'should notify add comment event'() {

        given:

        def user = createDefaultUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis(user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def comment = createComment(user)
        def card = createCard(column, user, feature, hypothesis)

        when:

        this.darwinNotificationService.addCommentCard(card, comment)

        then:

        1 * this.darwinNotificationApi.create(_)
        1 * this.environmentManager.getProperty(NotificationProperties.ADD_COMMENT_CARD.title) >> "ADD_COMMENT_TITLE"
        1 * this.environmentManager.getProperty(NotificationProperties.ADD_COMMENT_CARD.content) >> "ADD_COMMENT_CONTENT"

        notThrown()

    }

    private Build createBuild(User user, Feature feature, Hypothesis hypothesis, CardColumn column) {
        new Build("build-id", user, LocalDateTime.now(), [feature], "build-tag", hypothesis, column, BuildStatus.BUILT, "application-id", [], [])
    }

    def 'should notify new release event'() {

        given:

        def user = createDefaultUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis(user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)

        when:

        this.darwinNotificationService.newRelease(build)

        then:

        1 * this.darwinNotificationApi.create(_)
        1 * this.environmentManager.getProperty(NotificationProperties.NEW_RELEASE.title) >> "NEW_RELEASE_TITLE"
        1 * this.environmentManager.getProperty(NotificationProperties.NEW_RELEASE.content) >> "NEW_RELEASE_CONTENT"
        0 * this.userRepository.findById(user.id) >> Optional.ofNullable(user)

        notThrown()

    }

    def 'should notify a create deployment event'() {

        given:

        def user = createDefaultUser()
        def problem = createProblem(user)
        def hypothesis = createHypothesis(user, problem)
        def column = createCardColumn(hypothesis)
        def feature = createFeature(user)
        def build = createBuild(user, feature, hypothesis, column)
        def circle = createCircle(user)
        def deployment = createDeployment(user, circle, build)

        when:

        this.darwinNotificationService.createDeployment(deployment)

        then:

        1 * this.darwinNotificationApi.create(_)
        1 * this.environmentManager.getProperty(NotificationProperties.NEW_DEPLOYMENT.title) >> "NEW_DEPLOYMENT_TITLE"
        1 * this.environmentManager.getProperty(NotificationProperties.NEW_DEPLOYMENT.content) >> "NEW_DEPLOYMENT_CONTENT"
        0 * this.userRepository.findById(user.id) >> Optional.ofNullable(user)

        notThrown()

    }

    private Deployment createDeployment(User user, Circle circle, Build build) {
        new Deployment("deployment-id", user, LocalDateTime.now(), LocalDateTime.now(), DeploymentStatus.DEPLOYED, circle, build, "application-id")
    }

    private Circle createCircle(User user) {
        new Circle("circle-id", "developer", "reference", user, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, 1000, LocalDateTime.now())
    }

    private Comment createComment(User user) {
        new Comment("comment-id", user, LocalDateTime.now(), "Fake comment")
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
        new Feature("feature-id",
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

    private Hypothesis createHypothesis(User user, Problem problem) {
        new Hypothesis("hyp-id",
                "hyp-name",
                "hyp-description",
                user,
                LocalDateTime.now(),
                problem,
                [],
                [],
                [],
                [],
                "application-id")
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


    private User createDefaultUser() {
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



