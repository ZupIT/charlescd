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

package io.charlescd.circlematcher.api.resource

import io.charlescd.circlematcher.api.request.IdentificationRequest
import io.charlescd.circlematcher.domain.Circle
import io.charlescd.circlematcher.domain.service.IdentificationService
import spock.lang.Specification

class IdentificationResourceTest extends Specification {

    private IdentificationResource identificationResource

    private IdentificationService identificationService = Mock(IdentificationService)

    void setup() {
        identificationResource = new IdentificationResource(identificationService)
    }

    def "should identify the customer circles"() {

        given:

        def workspaceId = "78094351-7f16-4571-ac7a-7681db81e146"
        def data = new HashMap()
        data.put("username", "user@zup.com.br")
        def request = new IdentificationRequest(workspaceId, data)

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
