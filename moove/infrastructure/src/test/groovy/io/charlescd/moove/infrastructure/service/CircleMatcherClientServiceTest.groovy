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

package io.charlescd.moove.infrastructure.service

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.SimpleCircle
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.fixture.Fixtures
import io.charlescd.moove.infrastructure.service.client.CircleMatcherClient
import io.charlescd.moove.infrastructure.service.client.request.CircleMatcherRequest
import io.charlescd.moove.infrastructure.service.client.request.IdentifyRequest
import io.charlescd.moove.infrastructure.service.client.response.IdentifyResponse
import spock.lang.Specification

class CircleMatcherClientServiceTest extends Specification {

    private CircleMatcherService circleMatcherService

    private CircleMatcherClient circleMatcherClient = Mock(CircleMatcherClient)

    private CircleRepository circleRepository = Mock(CircleRepository)

    void setup() {
        this.circleMatcherService = new CircleMatcherClientService(circleMatcherClient, circleRepository, new ObjectMapper())
    }

    def "should create a new circle segmentation on circle matcher"() {
        given:
        def circle = Fixtures.circle().build()
        def matcherUri = "http://circle-matcher.com"

        when:
        this.circleMatcherService.create(circle, matcherUri)

        then:
        1 * circleMatcherClient.create(_, _) >> { arguments ->
            def uri = arguments[0]
            def request = arguments[1]

            assert uri instanceof URI
            assert request instanceof CircleMatcherRequest

            assert uri.toString() == matcherUri
            assert request.circleId == circle.id
            assert request.name == circle.name
            assert !request.default
            assert request.workspaceId == circle.workspaceId
            assert request.reference == circle.reference
            assert request.type == circle.matcherType.name()
            assert request.previousReference == null
            assert !request.active
            assert request.createdAt == circle.createdAt
        }
    }

    def "should update a circle segmentation on circle matcher"() {
        given:
        def previousReference = "c6e36515-cbfe-478d-83aa-3c185a5db4a4"
        def circle = Fixtures.circle().build()
        def matcherUri = "http://circle-matcher.com"

        when:
        this.circleMatcherService.update(circle, previousReference, matcherUri, false)

        then:
        1 * circleMatcherClient.update(_, _, _) >> { arguments ->
            def uri = arguments[0]
            def reference = arguments[1]
            def request = arguments[2]

            assert uri instanceof URI
            assert request instanceof CircleMatcherRequest

            assert reference == previousReference

            assert uri.toString() == matcherUri
            assert request.circleId == circle.id
            assert request.name == circle.name
            assert !request.default
            assert request.workspaceId == circle.workspaceId
            assert request.reference == circle.reference
            assert request.type == circle.matcherType.name()
            assert request.previousReference == reference
            assert !request.active
            assert request.createdAt == circle.createdAt
        }
    }

    def "should delete a segmentation on circle matcher"() {
        given:
        def reference = "c6e36515-cbfe-478d-83aa-3c185a5db4a4"
        def matcherUri = "http://circle-matcher.com"

        when:
        this.circleMatcherService.delete(reference, matcherUri)

        then:
        1 * circleMatcherClient.delete(_, _) >> { arguments ->
            def uri = arguments[0]
            def ref = arguments[1]

            assert uri instanceof URI
            assert uri.toString() == matcherUri

            assert ref == reference
        }
    }

    def "should return a list of circles that match request parameters"() {
        given:
        def workspace = Fixtures.workspace().withId("1f0e4b27-4db8-4698-b31b-9fbcacfc080f").build()
        def request = new HashMap<String, Object>()
        request.put("username", "zup")

        when:
        def response = this.circleMatcherService.identify(workspace, request)

        then:
        1 * circleMatcherClient.identify(_, _) >> { arguments ->
            def uri = arguments[0]
            def body = arguments[1]

            assert uri instanceof URI
            assert body instanceof IdentifyRequest

            assert uri.toString() == workspace.circleMatcherUrl
            assert body.workspaceId == workspace.id
            assert body.requestData == request

            return new IdentifyResponse([
                    new SimpleCircle("de2226ce-b557-44a2-ab6e-2c7b3f0b890f", "Women"),
                    new SimpleCircle("d9fe48cb-710f-4058-8009-e3521cac3006", "Default")
            ])
        }

        assert response != null
        assert response.size() == 2
        assert response[0].id == "de2226ce-b557-44a2-ab6e-2c7b3f0b890f"
        assert response[0].name == "Women"
        assert response[1].id == "d9fe48cb-710f-4058-8009-e3521cac3006"
        assert response[1].name == "Default"
    }

    def "should find the circles from workspace and delete from circle-matcher"() {
        given:
        def workspace = Fixtures.workspace().build()
        def matcherUri = "http://circle-matcher.com"
        when:
        circleMatcherService.deleteAllFor(workspace, matcherUri)
        then:
        1 * circleRepository.find(_, _, _, _) >> { arguments ->
            def name = arguments[0]
            def active = arguments[1]
            def workspaceId = arguments[2]

            assert name == null
            assert active == null
            assert workspaceId == workspace.id

            new Page([Fixtures.circle().build()], 0, 50, 1)
        }
        1 * circleMatcherClient.delete(_, _)
    }
}
