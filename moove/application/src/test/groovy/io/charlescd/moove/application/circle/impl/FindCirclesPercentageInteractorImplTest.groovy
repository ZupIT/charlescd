/*
 *
 *  Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

package io.charlescd.moove.application.circle.impl

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.CircleHistory
import io.charlescd.moove.domain.CircleStatusEnum
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.repository.CircleRepository
import spock.lang.Specification

import java.time.Duration
import java.time.LocalDateTime

class FindCirclesPercentageInteractorImplTest extends Specification {

    def circleRepository = Mock(CircleRepository)
    def findCirclesPercentageInteractor = new FindCirclesPercentageInteractorImpl(circleRepository)



    def 'should return the list of  percentage circles with name parameter'() {
        given:
        def nameForSearch = "name"
        def workspaceId = "workspace"
        def pageRequest = new PageRequest(0, 10)
        def percentageCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)
        def percentageCircle = getDummyCircle(percentageCircleId, author, null, workspaceId, false)
        def circles = new ArrayList();
        circles.add(percentageCircle)
        when:
        def result = findCirclesPercentageInteractor.execute(workspaceId, nameForSearch, false, pageRequest)

        then:
        1 * circleRepository.findCirclesPercentage(workspaceId, nameForSearch, false, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())

        result.page == 0
        result.size == 10
        result.isLast
        result.totalPages == 1
        result.content.size() == 1
    }

    def 'should return the list of  percentage circles without name parameter'() {
        given:
        def workspaceId = "workspace"
        def pageRequest = new PageRequest(0, 10)
        def percentageCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)
        def percentageCircle = getDummyCircle(percentageCircleId, author, null, workspaceId, false)
        def circles = new ArrayList();
        circles.add(percentageCircle)
        when:
        def result = findCirclesPercentageInteractor.execute(workspaceId, null, false, pageRequest)

        then:
        1 * circleRepository.findCirclesPercentage(workspaceId, null, false, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())

        result.page == 0
        result.size == 10
        result.isLast
        result.totalPages == 1
        result.content.size() == 1
    }

    def 'should return the list of  percentage circles with the correct sum of percentage'() {
        given:
        def nameForSearch = "name"
        def workspaceId = "workspace"
        def pageRequest = new PageRequest(0, 10)
        def percentageCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)
        def percentageCircle = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 30)
        def percentageCircleTwo = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 40)
        def circles = new ArrayList();
        circles.add(percentageCircle)
        circles.add(percentageCircleTwo)
        when:
        def result = findCirclesPercentageInteractor.execute(workspaceId, nameForSearch, false, pageRequest)

        then:
        1 * circleRepository.findCirclesPercentage(workspaceId, nameForSearch, false, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())

        result.page == 0
        result.size == 10
        result.isLast
        result.totalPages == 1
        result.content.size() == 1
        result.content[0].sumPercentage == 70
        result.content[0].circles.size() == 2
    }

    def 'should return the list of  percentage circles respecting the page size'() {
        given:
        def nameForSearch = "name"
        def workspaceId = "workspace"
        def pageRequest = new PageRequest(0, 3)
        def percentageCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def authorId = "89363883-cc6e-4711-8a2b-63c0665d5b7d"
        def author = getDummyUser(authorId)
        def percentageCircle = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 30)
        def percentageCircleTwo = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 10)
        def percentageCircleThree = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 10)
        def percentageCircleFour = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 10)
        def percentageCircleFive = getDummyCirclePercentage(percentageCircleId, author, null, workspaceId, false, 10)
        def circles = new ArrayList();
        circles.add(percentageCircle)
        circles.add(percentageCircleTwo)
        circles.add(percentageCircleThree)
        circles.add(percentageCircleFour)
        circles.add(percentageCircleFive)
        when:
        def result = findCirclesPercentageInteractor.execute(workspaceId, nameForSearch, false, pageRequest)

        then:
        1 * circleRepository.findCirclesPercentage(workspaceId, nameForSearch, false, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())

        result.page == 0
        result.size == 3
        !result.isLast
        result.totalPages == 2
        result.content.size() == 1
        result.content[0].circles.size() == 3
    }


    private static Circle getDummyCircle(String circleId, User author, NodePart nodePart, String workspaceId, Boolean isDefault) {
        new Circle(
                circleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                new ObjectMapper().valueToTree(nodePart),
                0,
                null,
                isDefault,
                workspaceId,
                false,
                null
        )
    }

    private static Circle getDummyCirclePercentage(String circleId, User author, NodePart nodePart, String workspaceId, Boolean isDefault, int percentage) {
        new Circle(
                circleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                author, LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                new ObjectMapper().valueToTree(nodePart),
                0,
                null,
                isDefault,
                workspaceId,
                false,
                percentage
        )
    }

    private static User getDummyUser(String authorId) {
        new User(
                authorId,
                "charles",
                "charles@zup.com.br",
                "http://charles.com/dummy_photo.jpg",
                [],
                false,
                LocalDateTime.now()
        )
    }
}
