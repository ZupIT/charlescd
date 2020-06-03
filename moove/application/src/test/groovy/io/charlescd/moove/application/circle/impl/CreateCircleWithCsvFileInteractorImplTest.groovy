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

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.charlescd.moove.application.*
import io.charlescd.moove.application.circle.CreateCircleWithCsvFileInteractor
import io.charlescd.moove.application.circle.request.CreateCircleWithCsvRequest
import io.charlescd.moove.application.circle.request.NodePart
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.CircleRepository
import io.charlescd.moove.domain.repository.KeyValueRuleRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.CircleMatcherService
import spock.lang.Specification

import java.time.LocalDateTime

class CreateCircleWithCsvFileInteractorImplTest extends Specification {

    private CreateCircleWithCsvFileInteractor createCircleWithCsvFileInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private CircleRepository circleRepository = Mock(CircleRepository)
    private CircleMatcherService circleMatcherService = Mock(CircleMatcherService)
    private KeyValueRuleRepository keyValueRuleRepository = Mock(KeyValueRuleRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new KotlinModule()).registerModule(new JavaTimeModule())
    private CsvSegmentationService csvSegmentationService = new CsvSegmentationService(objectMapper)

    void setup() {
        this.createCircleWithCsvFileInteractor = new CreateCircleWithCsvFileInteractorImpl(
                new UserService(userRepository),
                new CircleService(circleRepository),
                circleMatcherService,
                new KeyValueRuleService(keyValueRuleRepository),
                csvSegmentationService,
                new WorkspaceService(workspaceRepository, userRepository)
        )
    }

    def "should create a new circle with a csv file and return four rules on preview"() {
        given:
        def fileContent = "IDs\n" +
                "ce532f07-3bcf-40f8-9a39-289fb527ed54\n" +
                "c4b13c9f-d151-4f68-aad5-313b08503bd6\n" +
                "d77c5d16-a39f-406e-a33b-cee986b82348\n" +
                "2dd5fd08-c23a-494a-80b6-66db39c73630\n"

        def inputStream = new ByteArrayInputStream(fileContent.getBytes())

        def name = "Women"
        def workspaceId = "8470abce-ac40-43ee-84e6-391778eae77f"
        def keyName = "IDs"
        def authorId = "7cc8b676-a253-4350-a3c3-4fa0174fad98"

        def author = getDummyUser(authorId)
        def workspace = getDummyWorkspace(workspaceId, author)

        def request = new CreateCircleWithCsvRequest(name, authorId, keyName, inputStream)


        when:
        def response = this.createCircleWithCsvFileInteractor.execute(request, workspaceId)

        then:
        1 * this.userRepository.findById(authorId) >> Optional.of(author)
        1 * this.circleRepository.save(_) >> { arguments ->
            def circle = arguments[0]

            assert circle instanceof Circle
            assert circle.id != null
            assert circle.name == name
            assert circle.reference != null
            assert !circle.defaultCircle
            assert circle.author == author
            assert circle.createdAt != null
            assert circle.importedAt != null
            assert circle.matcherType == MatcherTypeEnum.SIMPLE_KV
            assert circle.workspaceId == workspaceId

            return circle
        }

        1 * this.circleRepository.update(_) >> { arguments ->
            def circle = arguments[0]

            assert circle instanceof Circle
            assert circle.id != null
            assert circle.name == name
            assert circle.reference != null
            assert !circle.defaultCircle
            assert circle.author == author
            assert circle.createdAt != null
            assert circle.importedAt != null
            assert circle.rules != null
            assert circle.importedKvRecords == 4
            assert circle.matcherType == MatcherTypeEnum.SIMPLE_KV
            assert circle.workspaceId == workspaceId

            return circle
        }

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.circleMatcherService.createImport(_, _, _) >> { arguments ->
            def circle = arguments[0]
            def nodes = arguments[1]
            def matcherUri = arguments[2]

            assert circle instanceof Circle
            assert nodes instanceof List<JsonNode>
            assert matcherUri == workspace.circleMatcherUrl
        }

        assert response != null
        assert response.id != null
        assert response.name == name
        assert response.importedKvRecords == 4
        assert response.workspaceId == workspaceId
        assert response.reference != null
        assert response.createdAt != null
        assert response.importedAt != null
        assert response.author.id == authorId
        assert response.matcherType == MatcherTypeEnum.SIMPLE_KV
        assert !response.default
        assert response.rules != null

        def rules = objectMapper.treeToValue(response.rules, NodePart.class)

        assert rules.type == NodePart.NodeTypeRequest.CLAUSE
        assert rules.clauses.size() == 1
        assert rules.clauses[0].clauses.size() == 4
    }

    def "should create a new circle with a csv file and return five rules on preview"() {
        given:
        def fileContent = "IDs\n" +
                "ce532f07-3bcf-40f8-9a39-289fb527ed54\n" +
                "c4b13c9f-d151-4f68-aad5-313b08503bd6\n" +
                "d77c5d16-a39f-406e-a33b-cee986b82348\n" +
                "2dd5fd08-c23a-494a-80b6-66db39c73630\n" +
                "14034c1e-7429-4835-8ba3-e836bd2e8bc4\n" +
                "c7819b88-55a6-458b-bebf-96af0e26ed2f"

        def inputStream = new ByteArrayInputStream(fileContent.getBytes())

        def name = "Women"
        def workspaceId = "8470abce-ac40-43ee-84e6-391778eae77f"
        def keyName = "IDs"
        def authorId = "7cc8b676-a253-4350-a3c3-4fa0174fad98"

        def author = getDummyUser(authorId)
        def workspace = getDummyWorkspace(workspaceId, author)

        def request = new CreateCircleWithCsvRequest(name, authorId, keyName, inputStream)


        when:
        def response = this.createCircleWithCsvFileInteractor.execute(request, workspaceId)

        then:
        1 * this.userRepository.findById(authorId) >> Optional.of(author)
        1 * this.circleRepository.save(_) >> { arguments ->
            def circle = arguments[0]

            assert circle instanceof Circle
            assert circle.id != null
            assert circle.name == name
            assert circle.reference != null
            assert !circle.defaultCircle
            assert circle.author == author
            assert circle.createdAt != null
            assert circle.importedAt != null
            assert circle.matcherType == MatcherTypeEnum.SIMPLE_KV
            assert circle.workspaceId == workspaceId

            return circle
        }

        1 * this.circleRepository.update(_) >> { arguments ->
            def circle = arguments[0]

            assert circle instanceof Circle
            assert circle.id != null
            assert circle.name == name
            assert circle.reference != null
            assert !circle.defaultCircle
            assert circle.author == author
            assert circle.createdAt != null
            assert circle.importedAt != null
            assert circle.rules != null
            assert circle.importedKvRecords == 6
            assert circle.matcherType == MatcherTypeEnum.SIMPLE_KV
            assert circle.workspaceId == workspaceId

            return circle
        }

        1 * this.workspaceRepository.find(workspaceId) >> Optional.of(workspace)

        1 * this.circleMatcherService.createImport(_, _, _) >> { arguments ->
            def circle = arguments[0]
            def nodes = arguments[1]
            def matcherUri = arguments[2]

            assert circle instanceof Circle
            assert nodes instanceof List<JsonNode>
            assert matcherUri == workspace.circleMatcherUrl
        }

        assert response != null
        assert response.id != null
        assert response.name == name
        assert response.importedKvRecords == 6 //current imported records
        assert response.workspaceId == workspaceId
        assert response.reference != null
        assert response.createdAt != null
        assert response.importedAt != null
        assert response.author.id == authorId
        assert response.matcherType == MatcherTypeEnum.SIMPLE_KV
        assert !response.default
        assert response.rules != null

        def rules = objectMapper.treeToValue(response.rules, NodePart.class)

        assert rules.type == NodePart.NodeTypeRequest.CLAUSE
        assert rules.clauses.size() == 1
        assert rules.clauses[0].clauses.size() == 5 //preview
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
}
