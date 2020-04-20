/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.ProblemRepresentation
import br.com.zup.darwin.commons.representation.ResourcePageRepresentation
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.problem.CreateProblemRequest
import br.com.zup.darwin.moove.request.problem.UpdateProblemRequest
import br.com.zup.darwin.moove.service.ProblemService
import org.springframework.data.domain.PageRequest
import spock.lang.Specification

import java.time.LocalDateTime

class ProblemControllerUnitTest extends Specification {

    ProblemService service = Mock(ProblemService)
    ProblemController controller
    String applicationId = "application-id"

    User user = new User(
            UUID.randomUUID().toString(),
            "Jon Snow",
            "email",
            "http://gameofthrones.com/bastard.png",
            [],
            LocalDateTime.now()
    )

    ProblemRepresentation problemRepresentation = new ProblemRepresentation(
            UUID.randomUUID().toString(),
            "Darwin",
            LocalDateTime.now(),
            [],
            0,
            "dummy-description"
    )

    def setup() {
        controller = new ProblemController(service)
    }

    def "should create a new problem"() {

        given:

        CreateProblemRequest request = new CreateProblemRequest(
                "Increase sales",
                user.id,
                "Increase sales number"
        )

        when:

        def response = this.controller.create(applicationId, request)

        then:

        1 * this.service.create(request, applicationId) >> problemRepresentation
        response.id == problemRepresentation.id
        response.createdAt == problemRepresentation.createdAt

    }

    def "should find a problem by id"() {

        when:

        def response = this.controller.findById(applicationId, this.problemRepresentation.id)

        then:

        1 * this.service.findById(_, _) >> problemRepresentation

        response.id == problemRepresentation.id
        response.createdAt == problemRepresentation.createdAt

    }

    def "should find the first page of problems"() {

        given:

        def pageable = PageRequest.of(0, 10)

        when:

        def response = this.controller.findAll(applicationId, pageable)

        then:

        1 * this.service.findAll(applicationId, pageable) >> new ResourcePageRepresentation<ProblemRepresentation>(
                [problemRepresentation],
                0,
                1,
                true,
                1
        )

        response.size == 1
        response.page == 0
        response.last
        response.content != null
        response.content.size() == 1

    }

    def "should delete a problem by id"() {

        when:

        this.controller.deleteById(applicationId, this.problemRepresentation.id)

        then:

        1 * this.service.deleteById(_, _)

    }

    def "should update a problem"() {

        given:

        UpdateProblemRequest request = new UpdateProblemRequest(
                "Increase sales updated",
                "Increase sales number updated"
        )

        when:
        def response = this.controller.updateById(applicationId, this.problemRepresentation.id, request)

        then:

        1 * this.service.updateById(_, _, _) >> new ProblemRepresentation(
                this.problemRepresentation.id,
                "Increase sales updated",
                this.problemRepresentation.createdAt,
                [],
                0,
                "Increase sales number updated"
        )

        response.id == this.problemRepresentation.id
        response.name == "Increase sales updated"
        response.createdAt == this.problemRepresentation.createdAt
        response.description == "Increase sales number updated"
    }

}
