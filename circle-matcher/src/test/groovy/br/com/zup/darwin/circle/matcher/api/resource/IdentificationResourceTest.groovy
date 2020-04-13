/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.api.resource

import br.com.zup.darwin.circle.matcher.domain.Circle
import br.com.zup.darwin.circle.matcher.domain.service.IdentificationService
import spock.lang.Specification

class IdentificationResourceTest extends Specification {

    private IdentificationResource identificationResource

    private IdentificationService identificationService = Mock(IdentificationService)

    void setup() {
        identificationResource = new IdentificationResource(identificationService)
    }

    def "should identify the customer circles"() {

        given:

        def request = new HashMap()
        request.put("username", "user@zup.com.br")

        def circle = new Circle("52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85", "Developer")
        def circles = new HashSet()
        circles.add(circle)

        when:

        def response = identificationResource.identify(request)

        then:

        assert response != null
        assert !response.circles.isEmpty()
        assert response.circles[0].id == "52eb5b4b-59ac-4361-a6eb-cb9f70eb6a85"
        assert response.circles[0].name == "Developer"

        1 * identificationService.identify(request) >> circles
    }
}
