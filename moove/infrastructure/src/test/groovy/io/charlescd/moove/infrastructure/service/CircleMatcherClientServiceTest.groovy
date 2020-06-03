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
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.service.CircleMatcherService
import io.charlescd.moove.infrastructure.service.client.CircleMatcherClient
import io.charlescd.moove.infrastructure.service.client.CircleMatcherRequest
import io.charlescd.moove.infrastructure.service.client.IdentifyRequest
import io.charlescd.moove.infrastructure.service.client.IdentifyResponse
import spock.lang.Specification

import java.time.LocalDateTime

class CircleMatcherClientServiceTest extends Specification {

    private CircleMatcherService circleMatcherService

    private CircleMatcherClient circleMatcherClient = Mock(CircleMatcherClient)

    void setup() {
        this.circleMatcherService = new CircleMatcherClientService(circleMatcherClient, new ObjectMapper())
    }

    def "should create a new circle segmentation on circle matcher"() {
        given:
        def user = getDummyUser()
        def circle = getDummyCircle("Women", user)
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
        }
    }

    def "should update a circle segmentation on circle matcher"() {
        given:
        def previousReference = "c6e36515-cbfe-478d-83aa-3c185a5db4a4"
        def user = getDummyUser()
        def circle = getDummyCircle("Women", user)
        def matcherUri = "http://circle-matcher.com"

        when:
        this.circleMatcherService.update(circle, previousReference, matcherUri)

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
        def author = getDummyUser()
        def workspace = getDummyWorkspace("1f0e4b27-4db8-4698-b31b-9fbcacfc080f", author)
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

    private User getDummyUser() {
        new User(
                '4e806b2a-557b-45c5-91be-1e1db909bef6',
                'User name',
                'user@email.com',
                'user.photo.png',
                new ArrayList<Workspace>(),
                false,
                LocalDateTime.now()
        )
    }

    private Workspace getDummyWorkspace(String workspaceId, User author) {
        new Workspace(
                workspaceId,
                "Charles",
                author,
                LocalDateTime.now(),
                [],
                WorkspaceStatusEnum.COMPLETE,
                null,
                "http://circle-matcher.com",
                null,
                null,
                null
        )
    }

    private Circle getDummyCircle(String name, User author) {
        new Circle(
                'w8296aea-6ae1-44ea-bc55-0242ac13000w',
                name,
                'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author,
                LocalDateTime.now(),
                MatcherTypeEnum.SIMPLE_KV,
                null,
                null,
                null,
                false,
                "44446b2a-557b-45c5-91be-1e1db9095556"
        )
    }
}
