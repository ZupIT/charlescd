/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.controller

import br.com.zup.darwin.commons.representation.LabelRepresentation
import br.com.zup.darwin.commons.representation.SimpleUserRepresentation
import br.com.zup.darwin.moove.request.label.CreateLabelRequest
import br.com.zup.darwin.moove.request.label.UpdateLabelRequest
import br.com.zup.darwin.moove.service.LabelService
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
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
        1 * service.findById("batata") >> { throw new NotFoundException(new ResourceValue("label", "batata")) }
        def e = thrown(NotFoundException)
        e.resource.resource == "label"
        e.resource.value == "batata"
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
