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


import io.charlescd.moove.domain.CircleHistory
import io.charlescd.moove.domain.CircleStatusEnum
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.repository.CircleRepository
import spock.lang.Specification

import java.time.Duration
import java.time.LocalDateTime

class FindCirclesHistoryInteractorImplTest extends Specification {

    def circleRepository = Mock(CircleRepository)
    def findCirclesHistoryInteractor = new FindCirclesHistoryInteractorImpl(circleRepository)

    def workspaceId = "workspace"
    def pageRequest = new PageRequest(0, 10)

    def 'should return the lifetime in seconds'() {
        given:
        def nameForSearch = "name"
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofMinutes(2))]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, nameForSearch, pageRequest)

        then:
        1 * circleRepository.findCirclesHistory(workspaceId, nameForSearch, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.page == 0
        result.size == 10
        result.isLast
        result.totalPages == 1
        result.content.size() == 1
        result.content[0].lifeTime == 120
    }

    private static CircleHistory buildCircleHistory(String id, CircleStatusEnum status, Duration lifeTime) {
        return new CircleHistory(id,
                status,
                "name ".concat(id),
                LocalDateTime.now(),
                lifeTime)
    }

    def 'should return ordered by status ascending and lifetime descending'() {
        given:
        def nameForSearch = "name"
        def circles = [buildCircleHistory("1", CircleStatusEnum.ACTIVE, Duration.ofMinutes(2)),
                       buildCircleHistory("2", CircleStatusEnum.ACTIVE, Duration.ofMinutes(5)),
                       buildCircleHistory("3", CircleStatusEnum.INACTIVE, Duration.ofMinutes(1))]

        when:
        def result = findCirclesHistoryInteractor.execute(workspaceId, nameForSearch, pageRequest)

        then:
        1 * circleRepository.findCirclesHistory(workspaceId, nameForSearch, pageRequest) >> new Page(circles, pageRequest.page, pageRequest.size, circles.size())
        0 * _

        result.page == 0
        result.size == 10
        result.isLast
        result.totalPages == 1
        result.content.size() == 3
        result.content[0].id == "2"
        result.content[1].id == "1"
        result.content[2].id == "3"
    }
}
