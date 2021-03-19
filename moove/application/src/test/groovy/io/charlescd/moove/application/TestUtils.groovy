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

package io.charlescd.moove.application

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*

import java.time.LocalDateTime

class TestUtils {

    static String getWorkspaceId() {
        return "a51e2a7b-f1ea-4ff8-a6aa-77b4ea92dae2"
    }

    static String getAuthorId() {
        return "d7abd3c1-15a3-45b6-84fb-f0e548aca230"
    }

    static String getAuthorIdRoot() {
        return "e7abd3c1-15a3-45b6-84fb-f0e548aca230"
    }

    static String getAuthorization() {
        return "Bearer eydGF0ZSI6ImE4OTZmOGFhLTIwZDUtNDI5Ny04YzM2LTdhZWJmZ_qq3"
    }

    static String getIntruderAuthorId() {
        return "qwwweabd3c1-15a3-45b6-84fb-f0e548ac123s"
    }

    static NodePart getNodePart() {
        def rulePart = new NodePart.RulePart("username", NodePart.ConditionEnum.EQUAL, ["zup"])
        def rule = new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, null, rulePart)
        return new NodePart(NodePart.NodeTypeRequest.CLAUSE, NodePart.LogicalOperatorRequest.OR, [rule], null)
    }

    static String getCirleId() {
        return "5a0d5b3f-8c28-49ab-a6d0-7b5d1296f610"
    }

    static String getEmail() {
        return "charles@zup.com.br"
    }

    static String getEmailRoot() {
        return "charlesadmin@zup.com.br"
    }


    static User getUser() {
        new User(
                authorId,
                "charles",
                email,
                "http://charles.com/dummy_photo.jpg",
                [],
                false,
                LocalDateTime.now()
        )
    }

    static User getUserRoot() {
        new User(
                authorIdRoot,
                "charles",
                emailRoot,
                "http://charles.com/dummy_photo.jpg",
                [],
                true,
                LocalDateTime.now()
        )
    }

    static Workspace getWorkspace() {
        new Workspace(
                workspaceId,
                "Charles",
                user,
                LocalDateTime.now(),
                [],
                WorkspaceStatusEnum.COMPLETE,
                "abb3448d8-4421-4aba-99a9-184bdabe3we1",
                "http://circle-matcher.com",
                "aa3448d8-4421-4aba-99a9-184bdabe3046",
                "cc3448d8-4421-4aba-99a9-184bdabeq233",
                null
        )
    }

    static Circle getCircle() {
        new Circle(
                cirleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                user, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                new ObjectMapper().valueToTree(nodePart),
                0,
                null,
                false,
                workspaceId,
                null
        )
    }

    static String getHypothesisId() {
        return "865758f1-17ea-4f96-8518-3490977fa0ea"
    }
}
