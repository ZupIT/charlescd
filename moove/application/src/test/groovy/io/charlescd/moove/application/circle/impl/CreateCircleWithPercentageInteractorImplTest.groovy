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

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.application.CircleService
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.circle.CreateCircleWithPercentageInteractor
import io.charlescd.moove.application.circle.request.CreateCircleRequest
import io.charlescd.moove.application.circle.request.CreateCircleWithPercentageRequest
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.application.circle.response.CircleResponse
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import org.jetbrains.annotations.NotNull
import spock.lang.Specification

import java.time.LocalDateTime

class CreateCircleWithPercentageInteractorImplTest extends Specification {

    private CreateCircleWithPercentageInteractor createCircleWIthPercentageInteractor

    private CircleRepository circleRepository = Mock(CircleRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)

    void setup() {
        this.createCircleWIthPercentageInteractor = new CreateCircleWithPercentageInteractorImpl(
                new CircleService(circleRepository),
                new UserService(userRepository),
                new WorkspaceService(workspaceRepository, userRepository),
                circleMatcherService
        );
    }

    def "should create a new circle with percentage"() {
        given:
        def circleId = "496b8a16-ba20-4ad7-941d-9f5122d48a74"
        def authorId = "96c63356-d416-46c3-a24e-c6b8c71cb718"
        def workspaceId = "983fcdc6-8adc-4baa-817b-17b587ff5dcb"

        def author = getDummyUser(authorId)
        def workspace = getDummyWorkspace(workspaceId, author)
        def circle = getDummyCircle(circleId, author, workspaceId, 20)

        def request = new CreateCircleWithPercentageRequest("Women", authorId, 20)

        when:
        def response = this.createCircleWIthPercentageInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleRepository.save(_) >> circle
        1 * circleMatcherService.create(circle, workspace.circleMatcherUrl)
        1 * this.circleRepository.countPercentageByWorkspaceId(workspaceId) >> 0


        notThrown(NotFoundException)

        assert response != null
        assert response.id == circle.id
        assert response.author.id == authorId
        assert response.createdAt == circle.createdAt
        assert response.matcherType == circle.matcherType
        assert response.name == circle.name
        assert response.reference == circle.reference
        assert response.workspaceId == circle.workspaceId
        assert response.default == circle.defaultCircle
        assert response.percentage == circle.percentage
        assert !response.default
    }

    def "should throw a NotFoundException when user does not exists"() {
        given:
        def authorId = "96c63356-d416-46c3-a24e-c6b8c71cb718"
        def workspaceId = "983fcdc6-8adc-4baa-817b-17b587ff5dcb"

        def request = new CreateCircleWithPercentageRequest("Women", authorId, 20)

        when:
        this.createCircleWIthPercentageInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.empty()

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "user"
        assert exception.id == authorId
    }

    def "should throw a NotFoundException when workspace does not exists"() {
        given:
        def authorId = "96c63356-d416-46c3-a24e-c6b8c71cb718"
        def workspaceId = "983fcdc6-8adc-4baa-817b-17b587ff5dcb"

        def request = new CreateCircleWithPercentageRequest("Women", authorId, 20)

        def author = getDummyUser(authorId)

        when:
        this.createCircleWIthPercentageInteractor.execute(request, workspaceId)

        then:
        1 * userRepository.findById(authorId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.empty()

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "workspace"
        assert exception.id == workspaceId
    }

    def "should throw a BusinessException when sum of percentage circles values  exceeds limit"() {
        given:
        def authorId = "96c63356-d416-46c3-a24e-c6b8c71cb718"
        def workspaceId = "983fcdc6-8adc-4baa-817b-17b587ff5dcb"

        def request = new CreateCircleWithPercentageRequest("Women", authorId, 20)

        when:
        this.createCircleWIthPercentageInteractor.execute(request, workspaceId)

        then:
        1 * circleRepository.countPercentageByWorkspaceId(workspaceId) >> 90
        def exception = thrown(BusinessException)

        assert exception.message == "limit.of.percentage.circles.exceeded"
    }

    def "should not throw a BusinessException when sum of percentage circles values not exceeds limit"() {
        given:
        def authorId = "96c63356-d416-46c3-a24e-c6b8c71cb718"
        def workspaceId = "983fcdc6-8adc-4baa-817b-17b587ff5dcb"
        def circleId = "496b8a16-ba20-4ad7-941d-9f5122d48a74"
        def author = getDummyUser(authorId)
        def workspace = getDummyWorkspace(workspaceId, author)
        def circle = getDummyCircle(circleId, author, workspaceId, 10)
        def request = new CreateCircleWithPercentageRequest("Women", authorId, 10)

        when:
        this.createCircleWIthPercentageInteractor.execute(request, workspaceId)

        then:
        1 * circleRepository.countPercentageByWorkspaceId(workspaceId) >> 90
        1 * userRepository.findById(authorId) >> Optional.of(author)
        1 * workspaceRepository.find(workspaceId) >> Optional.of(workspace)
        1 * circleRepository.save(_) >> circle
        1 * circleMatcherService.create(circle, workspace.circleMatcherUrl)

        notThrown(BusinessException)
    }

    private User getDummyUser(String authorId) {
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
                "aa3448d8-4421-4aba-99a9-184bdabe3046",
                null,
                null
        )
    }



    private Circle getDummyCircle(String circleId, User author, String workspaceId, int percentage) {
        new Circle(
                circleId,
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                author, LocalDateTime.now(),
                MatcherTypeEnum.PERCENTAGE,
                null,
                0,
                null,
                false,
                workspaceId,
                percentage
        )
    }
}
