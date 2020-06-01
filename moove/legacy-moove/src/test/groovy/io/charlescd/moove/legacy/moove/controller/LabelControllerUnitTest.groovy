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

package io.charlescd.moove.legacy.moove.controller

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.commons.representation.LabelRepresentation
import io.charlescd.moove.commons.representation.SimpleUserRepresentation
import io.charlescd.moove.legacy.moove.request.label.CreateLabelRequest
import io.charlescd.moove.legacy.moove.request.label.UpdateLabelRequest
import io.charlescd.moove.legacy.moove.service.LabelService
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.LocalDateTime

class LabelControllerUnitTest extends Specification {

    SimpleUserRepresentation user = new SimpleUserRepresentation("72f208e8-40cc-4180-ad4e-002b99cd9dcd", "John Doe", "email", "asdasd", LocalDateTime.now())
    LabelRepresentation representation = new LabelRepresentation("81861b6f-2b6e-44a1-a745-83e298a550c9", "Backend", LocalDateTime.now(), user, "FFAADD")
    Pageable pageable = PageRequest.of(0, 5)
    LabelService service = Mock(LabelService)
    LabelController controller

    def setup() {
        controller = new LabelController(service)
    }

    def "should find all labels"() {
        when:
        def response = controller.findAll(pageable)

        then:
        1 * service.findAll(pageable) >> new PageImpl<>([representation], pageable, 1)
        response.content.size() == 1
        response.last
        response.page == 0
        response.totalPages == 1
    }

    def "should find label by id"() {
        when:
        def response = controller.findById(representation.id)

        then:
        1 * service.findById(representation.id) >> representation
        response.id == representation.id
        response.name == representation.name
    }

    def "should return exception if service not found"() {
        when:
        controller.findById("batata")

        then:
        1 * service.findById("batata") >> { throw new NotFoundExceptionLegacy("label", "batata") }
        def e = thrown(NotFoundExceptionLegacy)
        e.resourceName == "label"
        e.id == "batata"
    }

    def "should create label"() {
        given:
        def request = new CreateLabelRequest("Backend", user.id, "BDBDBD")

        when:
        def response = controller.create(request)

        then:
        1 * service.create(request) >> representation
        response.id == "81861b6f-2b6e-44a1-a745-83e298a550c9"
        response.name == request.name
        response.author.id == request.authorId
        response.hexColor == response.hexColor
    }

    def "should update label"() {
        given:
        def request = new UpdateLabelRequest("Frontend", user.id, "FAFAFA")

        when:
        controller.update(representation.id, request)

        then:
        1 * service.update(representation.id, request)
        notThrown()
    }

    def "should delete label"() {
        when:
        controller.delete(representation.id)

        then:
        1 * service.delete(representation.id)
        notThrown()
    }
}
