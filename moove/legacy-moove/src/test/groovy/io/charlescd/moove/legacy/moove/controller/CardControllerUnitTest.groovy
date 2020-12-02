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

import io.charlescd.moove.commons.representation.CardColumnRepresentation
import io.charlescd.moove.commons.representation.CardRepresentation
import io.charlescd.moove.commons.representation.CommentRepresentation
import io.charlescd.moove.commons.representation.SimpleLabelRepresentation
import io.charlescd.moove.commons.representation.SimpleUserRepresentation
import io.charlescd.moove.commons.representation.UserRepresentation
import io.charlescd.moove.legacy.moove.request.card.CreateCardRequest
import io.charlescd.moove.legacy.moove.request.card.UpdateCardRequest
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.moove.request.user.ResetPasswordRequest
import io.charlescd.moove.legacy.moove.request.user.UpdateUserRequest
import io.charlescd.moove.legacy.moove.service.CardService
import io.charlescd.moove.legacy.moove.service.KeycloakService
import io.charlescd.moove.legacy.moove.service.UserServiceLegacy
import org.keycloak.representations.idm.GroupRepresentation
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import java.time.LocalDateTime

class CardControllerUnitTest extends Specification {

    String workspaceId = "09s861b6f-2b6e-44a1-a745-83e298a5ssl3"
    String id = "3ass861b6f-2b6e-44a1-a745-83e298a5asd2"


    CardService service = Mock(CardService)
    CardController controller

    def "setup"() {
        controller = new CardController(service)
    }

    def "should create action card"() {
        given:

        def request = new CreateCardRequest(
                "Card name",
                "Card description",
                "qw2131b6f-2b6e-44a1-a745-83e298y56dr3",
                "SoftwareCard",
                new ArrayList<String>(),
                "81861b6f-2b6e-44a1-a745-83e298a550c9",
                "branchName",
                new ArrayList<String>()

        )

        when:
        controller.create(workspaceId, request)

        then:
        1 * service.create(request, workspaceId)
        notThrown()
    }

    def "should update card"() {
        given:
        def request = new UpdateCardRequest(
                "Card name",
                "Card description",
                new ArrayList<String>(),
                "SoftwareCard",
                "branchName",
                new ArrayList<String>(),
                false

        )

        when:
        controller.update(workspaceId, id, request)

        then:
        1 * service.update(id, request, workspaceId)
        notThrown()
    }

    def "should delete card"() {
        when:
        controller.delete(workspaceId, true, id)

        then:
        1 * service.delete(id, workspaceId, true)
        notThrown()
    }

    def "should archive card"() {
        when:
        controller.archive(workspaceId, id)

        then:
        1 * service.archiveCard(id, workspaceId)
        notThrown()
    }

    def "should get card"() {
        when:
        controller.findById(workspaceId, id)

        then:
        1 * service.findById(id, workspaceId)
        notThrown()
    }

}
