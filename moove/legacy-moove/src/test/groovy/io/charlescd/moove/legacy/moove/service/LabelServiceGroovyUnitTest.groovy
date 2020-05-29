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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.extension.MooveEntityToRepresentationKt
import io.charlescd.moove.commons.representation.LabelRepresentation
import io.charlescd.moove.legacy.moove.request.label.CreateLabelRequest
import io.charlescd.moove.legacy.moove.request.label.UpdateLabelRequest
import io.charlescd.moove.legacy.repository.LabelRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.Label
import io.charlescd.moove.legacy.repository.entity.User
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.Clock
import java.time.LocalDateTime

class LabelServiceGroovyUnitTest extends Specification {

    Clock clock = Clock.systemDefaultZone()
    User user = new User("41b78027-4a92-43ec-9ee6-893845ffd6ff", "John Doe", "email", "nophoto", false, LocalDateTime.now())
    UserRepository userRepository = Mock(UserRepository)

    Label label = new Label("4a45cf5b-1467-4996-8ee0-e121c2e88540", "Name", LocalDateTime.now(), user, "CDFECD")
    LabelRepresentation representation = MooveEntityToRepresentationKt.toRepresentation(label)
    Pageable pageable = PageRequest.of(0, 5)
    LabelRepository repository = Mock(LabelRepository)
    LabelService service

    def setup() {
        service = new LabelService(repository, userRepository, clock)
    }

    def "should find all labels"() {
        when:
        def response = service.findAll(pageable)

        then:
        1 * repository.findAll(pageable) >> new PageImpl<>([label], pageable, 1)
        response.size() == 1
    }

    def "should find label by id"() {
        when:
        def response = service.findById(representation.id)

        then:
        1 * repository.findById(representation.id) >> Optional.of(label)
        representation.id == response.id
        representation.name == response.name
        representation.hexColor == response.hexColor
        representation.author == response.author
        representation.createdAt == response.createdAt
    }

    def "should throw exception on findById if id do not exist"() {
        when:
        service.findById("batatinha")

        then:
        1 * repository.findById("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "label"
        ex.id == "batatinha"
    }

    def "should create label"() {
        given:
        def request = new CreateLabelRequest("Back", user.id, "CDFECD")

        when:
        def response = service.create(request)

        then:
        1 * repository.save(_) >> label
        1 * userRepository.findById(user.id) >> Optional.of(user)
        representation.id == response.id
        representation.name == response.name
        representation.hexColor == response.hexColor
        representation.author == response.author
        representation.createdAt == response.createdAt
        notThrown()
    }

    def "should not create label if user do not exist"() {
        given:
        def request = new CreateLabelRequest("Back", "idontexist", "CDFECD")
        when:
        service.create(request)

        then:
        1 * userRepository.findById("idontexist") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "idontexist"
    }

    def "should update label by id"() {
        given:
        def request = new UpdateLabelRequest("Front", user.id, "CDFECD")

        when:
        def response = service.update(representation.id, request)

        then:
        1 * repository.findById(representation.id) >> Optional.of(label)
        1 * repository.save(_) >> label
        1 * userRepository.findById(user.id) >> Optional.of(user)
        representation.id == response.id
        representation.name == response.name
        representation.hexColor == response.hexColor
        representation.author == response.author
        representation.createdAt == response.createdAt
    }

    def "should throw exception on update if label id do not exist"() {
        given:
        def request = new UpdateLabelRequest("Front", user.id, "CDFECD")

        when:
        service.update("batatinha", request)

        then:
        1 * repository.findById("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "label"
        ex.id == "batatinha"
    }

    def "should throw exception on update if author id do not exist"() {
        given:
        def request = new UpdateLabelRequest("Front", "idontexist", "CDFECD")

        when:
        service.update(representation.id, request)

        then:
        1 * repository.findById(representation.id) >> Optional.of(label)
        1 * userRepository.findById("idontexist") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == "idontexist"
    }

    def "should delete by id"() {
        when:
        def response = service.delete(representation.id)

        then:
        1 * repository.findById(representation.id) >> Optional.of(label)
        1 * repository.delete(label)
        representation.id == response.id
        representation.name == response.name
        representation.hexColor == response.hexColor
        representation.author == response.author
        representation.createdAt == response.createdAt
        notThrown()
    }

    def "should throw exception on delete if label id do not exist"() {
        when:
        service.delete("batatinha")

        then:
        1 * repository.findById("batatinha") >> Optional.empty()
        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "label"
        ex.id == "batatinha"
    }
}

