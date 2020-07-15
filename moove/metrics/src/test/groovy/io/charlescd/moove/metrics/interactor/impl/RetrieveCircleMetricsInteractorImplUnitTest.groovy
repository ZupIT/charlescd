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

package io.charlescd.moove.metrics.interactor.impl

import io.charlescd.moove.domain.CircleCount
import io.charlescd.moove.domain.CircleStatusEnum
import io.charlescd.moove.domain.repository.CircleRepository
import spock.lang.Specification

import java.time.Duration

class RetrieveCircleMetricsInteractorImplUnitTest extends Specification {

    def circleRepository = Mock(CircleRepository)
    def retrieveCirclesMetricsInteractorImpl = new RetrieveCirclesMetricsInteractorImpl(circleRepository)

    def workspaceId = "workspace-id"

    def 'when no active circle found should return with zeroed value'() {
        given:
        def inactiveCircleMetric = new CircleCount(10, CircleStatusEnum.INACTIVE)

        when:
        def result = retrieveCirclesMetricsInteractorImpl.execute(workspaceId)

        then:
        1 * circleRepository.countByWorkspaceGroupedByStatus(workspaceId) >> [inactiveCircleMetric]
        1 * circleRepository.getCircleAverageLifeTime(workspaceId) >> Duration.ofSeconds(30000)
        0 * _

        result.circleStats.active == 0
        result.circleStats.inactive == 10
        result.averageLifeTime == 30000
    }

    def 'when no inactive circle found should return with zeroed value'() {
        given:
        def activeCircleMetric = new CircleCount(10, CircleStatusEnum.ACTIVE)

        when:
        def result = retrieveCirclesMetricsInteractorImpl.execute(workspaceId)

        then:
        1 * circleRepository.countByWorkspaceGroupedByStatus(workspaceId) >> [activeCircleMetric]
        1 * circleRepository.getCircleAverageLifeTime(workspaceId) >> Duration.ofSeconds(30000)
        0 * _

        result.circleStats.active == 10
        result.circleStats.inactive == 0
        result.averageLifeTime == 30000
    }

    def 'when ok should return the values'() {
        given:
        def activeCircleMetric = new CircleCount(10, CircleStatusEnum.ACTIVE)
        def inactiveCircleMetric = new CircleCount(9, CircleStatusEnum.INACTIVE)

        when:
        def result = retrieveCirclesMetricsInteractorImpl.execute(workspaceId)

        then:
        1 * circleRepository.countByWorkspaceGroupedByStatus(workspaceId) >> [activeCircleMetric, inactiveCircleMetric]
        1 * circleRepository.getCircleAverageLifeTime(workspaceId) >> Duration.ofSeconds(30000)
        0 * _

        result.circleStats.active == 10
        result.circleStats.inactive == 9
        result.averageLifeTime == 30000
    }

}
