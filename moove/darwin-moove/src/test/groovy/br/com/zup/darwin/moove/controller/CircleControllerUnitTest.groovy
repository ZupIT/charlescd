/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.entity.DeploymentStatus
import br.com.zup.darwin.entity.MatcherType
import br.com.zup.darwin.moove.api.request.NodeRequest
import br.com.zup.darwin.moove.api.request.NodeRequest.Node.RuleRequest
import br.com.zup.darwin.moove.request.circle.CreateCircleRequest
import br.com.zup.darwin.moove.request.circle.UpdateCircleRequest
import br.com.zup.darwin.moove.service.CircleService
import com.fasterxml.jackson.databind.JsonNode
import org.springframework.data.domain.PageRequest
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification
import spock.lang.Unroll

import java.time.LocalDateTime

class CircleControllerUnitTest extends Specification {

    private CircleController controller
    private CircleService circleService = Mock(CircleService)
    private JsonNode jsonNode = Mock(JsonNode)
    private RuleRequest ruleRequest = new RuleRequest("fake-key", "fake-condition", ["fake-data"])
    private MultipartFile multipartFile = Mock(MultipartFile)

    def setup() {
        this.controller = new CircleController(circleService)
    }

    def 'should find circle by id'() {
        given:
        def circleId = "fake-circle-id"
        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation("fake-id", "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)

        when:
        def response = this.controller.findById(circleId)

        then:

        1 * this.circleService.findById(circleId) >> representation

        assert response != null
        assert representation.id == response.id
        notThrown()
    }

    @Unroll
    def 'should find all circles for name #name and active #active'() {
        given:

        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation("fake-id", "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)
        def pageRequest = new PageRequest(0, 1)

        when:
        def response = this.controller.findAll(name, active, pageRequest)

        then:

        1 * circleService.findAll(name, active, pageRequest) >> new ResourcePageRepresentation<CircleRepresentation>(
                [representation],
                0,
                1,
                true,
                1
        )
        0 * _

        assert response.totalPages == 1
        assert !response.content.isEmpty()
        assert representation.id == response.content[0].id
        assert representation.name == response.content[0].name
        notThrown()

        where:
        active  | name          | circleRepresentation
        true    | null          | new SimpleCircleRepresentation("fake-id", "name", LocalDateTime.now(), getFindAllDeploymentRepresentation())
        false   | null          | new SimpleCircleRepresentation("fake-id", "name", LocalDateTime.now(), null)
        true    | "name-search" | new SimpleCircleRepresentation("fake-id", "name-search", LocalDateTime.now(), getFindAllDeploymentRepresentation())
        false   | "name-search" | new SimpleCircleRepresentation("fake-id", "name-search", LocalDateTime.now(), null)

    }

    private BasicDeploymentRepresentation getFindAllDeploymentRepresentation(){
        def build = new FlatBuildRepresentation("fake-build-id", "tag")
        return new BasicDeploymentRepresentation("fake-deployment-id", LocalDateTime.now(), DeploymentStatus.DEPLOYED.name(), build)
    }

    def 'should delete a circle'() {
        given:
        def circleId = "fake-circle-id"

        when:
        this.controller.delete(circleId)

        then:

        1 * this.circleService.delete(circleId)
        notThrown()
    }

    def 'should create a circle'() {
        given:
        def circleId = "fake-circle-id"
        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation(circleId, "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)
        def rules = new NodeRequest.Node(NodeRequest.Node.NodeTypeRequest.CLAUSE, NodeRequest.Node.LogicalOperatorRequest.AND, [], ruleRequest)
        def request = new CreateCircleRequest("fake-circle-name", "fake-user-id", rules)

        when:
        def response = this.controller.create(request)

        then:

        1 * this.circleService.create(request) >> representation

        assert response != null
        assert response.id == representation.id
        assert response.name == representation.name

        notThrown()
    }

    def 'should update a circle'() {
        given:
        def circleId = "fake-circle-id"

        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation(circleId, "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)
        def rules = new NodeRequest.Node(NodeRequest.Node.NodeTypeRequest.CLAUSE, NodeRequest.Node.LogicalOperatorRequest.AND, [], ruleRequest)
        def request = new UpdateCircleRequest("fake-name", rules)

        when:
        def response = this.controller.update(circleId, request)

        then:
        1 * this.circleService.update(circleId, request) >> representation

        assert response != null
        assert response.id == representation.id
        assert response.name == representation.name

        notThrown()
    }

    def 'should create a circle with csv file'() {
        given:
        def circleId = "fake-circle-id"
        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation(circleId, "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)

        def name = "Developer"

        when:
        def response = this.controller.createWithCsv(name, author.id, "IDs", multipartFile)

        then:
        1 * this.circleService.createWithCsv(_, _, _, _) >> representation

        assert response != null
        assert response.id == representation.id
        assert response.name == representation.name
        assert representation.matcherType == MatcherType.SIMPLE_KV

        notThrown()
    }

    def 'should update a circle with csv file'() {
        given:
        def circleId = "fake-circle-id"
        def author = new SimpleUserRepresentation("user-fake-id", "user-name", "user@zup.com.br", "http://user.com.br/photo.jpg", LocalDateTime.now())
        def representation = new CircleRepresentation(circleId, "name", author, LocalDateTime.now(), MatcherType.SIMPLE_KV, jsonNode, null, LocalDateTime.now(), 1000)

        def name = "Developer"

        when:
        def response = this.controller.updateWithCsv(circleId, name, "IDs", multipartFile)

        then:
        1 * this.circleService.updateWithCsv(_, _, _, _) >> representation

        assert response != null
        assert response.id == representation.id
        assert response.name == representation.name
        assert representation.matcherType == MatcherType.SIMPLE_KV

        notThrown()
    }

}
