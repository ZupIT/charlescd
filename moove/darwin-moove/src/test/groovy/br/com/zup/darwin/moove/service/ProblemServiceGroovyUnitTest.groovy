/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.entity.Problem
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.problem.CreateProblemRequest
import br.com.zup.darwin.moove.request.problem.UpdateProblemRequest
import br.com.zup.darwin.repository.ProblemRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import spock.lang.Specification

import java.time.LocalDateTime

class ProblemServiceGroovyUnitTest extends Specification {

    private String applicationId = "application-id"

    User user = new User(UUID.randomUUID().toString(), "Jon Snow", "email", "http://test.com/bastard.png", [], LocalDateTime.now())
    Problem problem = new Problem(
            UUID.randomUUID().toString(),
            "Increase sales",
            LocalDateTime.now(),
            this.user,
            "Increase sales number",
            [],
            "application-id"
    )

    UserRepository userRepository = Mock(UserRepository)
    ProblemRepository problemRepository = Mock(ProblemRepository)
    ProblemService service

    def setup() {
        service = new ProblemService(userRepository, problemRepository)
    }

    def "should create a new problem"() {
        given:
        CreateProblemRequest request = new CreateProblemRequest("Increase sales", this.user.id, "Increase sales number")

        when:
        def created = this.service.create(request, applicationId)

        then:
        1 * this.userRepository.findById(request.authorId) >> Optional.of(this.user)
        1 * this.problemRepository.save(_) >> this.problem

        created != null
        created.id != null
        created.name == request.name
        created.createdAt != null
        created.name == request.name

    }

    def "should find all problems"() {
        given:
        def pageable = PageRequest.of(0, 1)

        when:
        def page = this.service.findAll(applicationId, pageable)

        then:
        1 * this.problemRepository.findAllByApplicationId(applicationId, pageable) >> new PageImpl<>([problem], pageable, 1L)

        page != null
        page.content != null
        page.size == 1
        page.page == 0
        page.last
        page.totalPages == 1

    }

    def "should find problem by id"() {
        when:
        def representation = this.service.findById(this.problem.id, applicationId)

        then:
        1 * this.problemRepository.findByIdAndApplicationId(this.problem.id, applicationId) >> Optional.of(this.problem)

        representation != null
        representation.id == this.problem.id
        representation.name == this.problem.name
        representation.createdAt != null

    }

    def "should update problem by id"() {
        given:
        UpdateProblemRequest request = new UpdateProblemRequest("Increase sales updated", "Update problem")

        when:
        def representation = this.service.updateById(this.problem.id, request, applicationId)

        then:
        1 * this.problemRepository.findByIdAndApplicationId(this.problem.id, applicationId) >> Optional.of(this.problem)
        1 * this.problemRepository.save(_) >> new Problem(
                this.problem.id,
                request.name,
                this.problem.createdAt,
                this.problem.author,
                request.description,
                [],
                applicationId
        )

        representation != null
        representation.id == this.problem.id
        representation.name == request.name
        representation.createdAt != null

    }

    def "should delete problem by id"() {
        when:
        this.service.deleteById(this.problem.id, applicationId)

        then:
        1 * this.problemRepository.findByIdAndApplicationId(this.problem.id, applicationId) >> Optional.of(this.problem)
        1 * this.problemRepository.delete(_)

    }

    def "should throw exception on delete problem by id"() {
        when:
        this.service.deleteById(this.problem.id, applicationId)

        then:
        1 * this.problemRepository.findByIdAndApplicationId(this.problem.id, applicationId) >> Optional.empty()
        def ex = thrown(NotFoundException)
        assert ex.resource.resource == "problem"
        assert ex.resource.value == this.problem.id

    }

    def "should throw exception on find problem by id"() {
        when:
        this.service.findById(this.problem.id, applicationId)

        then:
        1 * this.problemRepository.findByIdAndApplicationId(this.problem.id, applicationId) >> Optional.empty()
        def ex = thrown(NotFoundException)
        assert ex.resource.resource == "problem"
        assert ex.resource.value == this.problem.id
    }
}
