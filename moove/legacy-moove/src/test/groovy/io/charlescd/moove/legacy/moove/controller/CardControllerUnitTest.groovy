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

import io.charlescd.moove.commons.request.comment.AddCommentRequest
import io.charlescd.moove.commons.request.member.AddMemberRequest
import io.charlescd.moove.legacy.moove.request.card.CreateCardRequest
import io.charlescd.moove.legacy.moove.request.card.UpdateCardRequest
import io.charlescd.moove.legacy.moove.request.git.FindBranchParam
import io.charlescd.moove.legacy.moove.service.CardService
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import spock.lang.Specification

class CardControllerUnitTest extends Specification {

    String workspaceId = "09s861b6f-2b6e-44a1-a745-83e298a5ssl3"
    String id = "3ass861b6f-2b6e-44a1-a745-83e298a5asd2"
    String authorization = "Bearer qwerty"

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
                "SoftwareCard",
                new ArrayList<String>(),
                "81861b6f-2b6e-44a1-a745-83e298a550c9",
                "branchName",
                new ArrayList<String>()

        )

        when:
        controller.create(authorization, workspaceId, request)

        then:
        1 * service.create(request, workspaceId, authorization)
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

    def "should not delete card"() {
        when:
        controller.delete(workspaceId, false, id)

        then:
        1 * service.delete(id, workspaceId, false)
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

    def "should find branches"() {
        given:
        def param = new FindBranchParam (
                ["id_1, id_2"],
                "branchName"
        )

        when:
        controller.findBranches(workspaceId, param)

        then:
        1 * service.findBranches(param, workspaceId)
        notThrown()
    }

    def "should add a member"() {
        given:
        def request = new AddMemberRequest(
                "authorId",
                ["member1", "member2"]
        )

        when:
        controller.addMembers(authorization, workspaceId,  id, request)

        then:
        1 * service.addMembers(id, request, workspaceId, authorization)
        notThrown()
    }

    def "should remove a member"() {
        given:

        def memberId = "memberId"

        when:
        controller.removeMember(workspaceId, id, memberId)

        then:
        1 * service.removeMember(id, memberId, workspaceId)
        notThrown()
    }

    def "should add a comment"() {
        given:
        def request = new AddCommentRequest(
                "comment"
        )

        when:
        controller.addComment(authorization,  workspaceId, id, request)

        then:
        1 * service.addComment(id, request, workspaceId, authorization)
        notThrown()
    }
}
