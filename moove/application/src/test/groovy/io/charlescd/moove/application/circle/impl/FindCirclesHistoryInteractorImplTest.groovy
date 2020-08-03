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


import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.CircleRepository
import spock.lang.Specification

import java.time.Duration
import java.time.LocalDateTime

class FindCirclesHistoryInteractorImplTest extends Specification {

    def circleRepository = Mock(CircleRepository)
    def findCirclesHistoryInteractor = new FindCirclesHistoryInteractorImpl(circleRepository)

    def workspaceId = "workspace"
    def pageRequest = new PageRequest(0, 10)

    def 'should return active summary zeroed when status not present'() {
        given:
        def circles = [buildCircleHistory("1", CircleStatusEnum.INACTIVE, Duration.ofSeconds(120)),
                       buildCircleHistory("2", CircleStatusEnum.INACTIVE, Duration.ofSeconds(120))]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, null, pageRequest)

        then:
        1 * circleRepository.countGroupedByStatus(workspaceId, null) >> [new CircleCount(2, CircleStatusEnum.INACTIVE)]
        1 * circleRepository.findCirclesHistory(workspaceId, null, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.summary.active == 0
        result.summary.inactive == 2
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 2
        result.page.content.stream()
                .allMatch({ it -> it.status == CircleStatusEnum.INACTIVE })
    }

    def 'should return inactive summary zeroed when status not present'() {
        given:
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofSeconds(120)),
                       buildCircleHistory("2", CircleStatusEnum.ACTIVE, Duration.ofSeconds(120))]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, null, pageRequest)

        then:
        1 * circleRepository.countGroupedByStatus(workspaceId, null) >> [new CircleCount(2, CircleStatusEnum.ACTIVE)]
        1 * circleRepository.findCirclesHistory(workspaceId, null, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.summary.active == 2
        result.summary.inactive == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 2
        result.page.content.stream()
                .allMatch({ it -> it.status == CircleStatusEnum.ACTIVE })
    }

    def 'should return ok when found everything'() {
        given:
        def nameForSearch = "name"
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofSeconds(120)),
                       buildCircleHistory("2", CircleStatusEnum.ACTIVE, Duration.ofSeconds(130)),
                       buildCircleHistory("3", CircleStatusEnum.INACTIVE, Duration.ofSeconds(150))]

        def summary = [new CircleCount(2, CircleStatusEnum.ACTIVE),
                       new CircleCount(1, CircleStatusEnum.INACTIVE)]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, nameForSearch, pageRequest)

        then:
        1 * circleRepository.countGroupedByStatus(workspaceId, nameForSearch) >> summary
        1 * circleRepository.findCirclesHistory(workspaceId, nameForSearch, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.summary.active == 2
        result.summary.inactive == 1
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 3
    }

    def 'should return the lifetime in seconds'() {
        given:
        def nameForSearch = "name"
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofMinutes(2))]

        def summary = [new CircleCount(1, CircleStatusEnum.ACTIVE)]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, nameForSearch, pageRequest)

        then:
        1 * circleRepository.countGroupedByStatus(workspaceId, nameForSearch) >> summary
        1 * circleRepository.findCirclesHistory(workspaceId, nameForSearch, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.summary.active == 1
        result.summary.inactive == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 1
        result.page.content[0].lifeTime == 120
    }

    def 'should return the ordered by lifetime descending'() {
        given:
        def nameForSearch = "name"
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofSeconds(120)),
                       buildCircleHistory("2", CircleStatusEnum.ACTIVE, Duration.ofSeconds(150)),
                       buildCircleHistory("3", CircleStatusEnum.ACTIVE, Duration.ofSeconds(130))]

        def summary = [new CircleCount(3, CircleStatusEnum.ACTIVE)]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, nameForSearch, pageRequest)

        then:
        1 * circleRepository.countGroupedByStatus(workspaceId, nameForSearch) >> summary
        1 * circleRepository.findCirclesHistory(workspaceId, nameForSearch, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.summary.active == 3
        result.summary.inactive == 0
        result.page.page == 0
        result.page.size == 10
        result.page.isLast
        result.page.totalPages == 1
        result.page.content.size() == 3
        result.page.content[0].lifeTime == 150
        result.page.content[1].lifeTime == 130
        result.page.content[2].lifeTime == 120
    }

    private static CircleHistory buildCircleHistory(String id, CircleStatusEnum status, Duration lifeTime) {
        return new CircleHistory(id,
                status,
                "name ".concat(id),
                LocalDateTime.now(),
                lifeTime)
    }

}
