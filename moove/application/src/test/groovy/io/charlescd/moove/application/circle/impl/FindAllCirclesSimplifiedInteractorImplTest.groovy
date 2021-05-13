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

package io.charlescd.moove.application.circle.impl


import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.circle.FindAllCirclesSimpleInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.CircleRepository
import spock.lang.Specification

class FindAllCirclesSimplifiedInteractorImplTest extends Specification {

    private FindAllCirclesSimpleInteractor findAllCirclesSimpleInteractor

    private CircleRepository circleRepository = Mock(CircleRepository)

    void setup() {
        this.findAllCirclesSimpleInteractor = new FindAllCirclesSimpleInteractorImpl(
                new CircleService(circleRepository)
        )
    }

    def "should find all circles without name parameter"() {
        given:
        def workspaceId = "d3828cdb-b87c-4360-a3b6-4563aff459a8"
        def pageRequest = new PageRequest(0, 10)

        def womenCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def womenCircle = getDummyCircle(womenCircleId)

        def menCircleId = "6d19ab59-33c1-4145-9637-0ebdaa5703bf"
        def menCircle = getDummyCircle(menCircleId)

        def circleList = [womenCircle, menCircle]

        when:
        def response = this.findAllCirclesSimpleInteractor.execute(null, null, workspaceId, pageRequest)

        then:
        1 * this.circleRepository.find(_, _, _, _) >> { arguments ->

            assert arguments[0] == null
            assert arguments[1] == null
            assert arguments[2] == workspaceId
            assert arguments[3] == pageRequest

            return new Page<SimpleCircle>(circleList, 0, 10, 1)
        }

        assert response != null
        assert response.content != null
        assert !response.content.isEmpty()
        assert response.isLast
        assert response.page == 0
        assert response.totalPages == 1
        assert response.content[0].id == womenCircleId
        assert response.content[1].id == menCircleId
    }

    def "should find all circles with except and name parameter"() {
        given:
        def workspaceId = "d3828cdb-b87c-4360-a3b6-4563aff459a8"
        def pageRequest = new PageRequest(0, 10)

        def womenCircleId = "4b664b17-ca05-4ced-a73c-1293f8d0f756"
        def womenCircle = getDummyCircle(womenCircleId)

        def menCircleId = "6d19ab59-33c1-4145-9637-0ebdaa5703bf"
        def menCircle = getDummyCircle(menCircleId)

        def circleList = [womenCircle, menCircle]

        when:
        def response = this.findAllCirclesSimpleInteractor.execute("Women", "4b664b17-ca05-4ced-a73c-1293f8d0f756", workspaceId, pageRequest)

        then:
        1 * this.circleRepository.find(_, _, _, _) >> { arguments ->

            assert arguments[0] == "Women"
            assert arguments[1] == "4b664b17-ca05-4ced-a73c-1293f8d0f756"
            assert arguments[2] == workspaceId
            assert arguments[3] == pageRequest

            return new Page<Circle>(circleList, 0, 10, 1)
        }

        assert response != null
        assert response.content != null
        assert !response.content.isEmpty()
        assert response.isLast
        assert response.page == 0
        assert response.totalPages == 1
        assert response.content[0].id == womenCircleId
        assert response.content[1].id == menCircleId
    }


    private static SimpleCircle getDummyCircle(String circleId) {
        new SimpleCircle(
                circleId,
                "Women"
        )
    }

}
