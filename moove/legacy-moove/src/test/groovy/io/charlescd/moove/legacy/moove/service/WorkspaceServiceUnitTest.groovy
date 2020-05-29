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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.legacy.repository.WorkspaceRepository
import io.charlescd.moove.legacy.repository.entity.User
import io.charlescd.moove.legacy.repository.entity.Workspace
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import spock.lang.Specification

import java.time.LocalDateTime

class WorkspaceServiceUnitTest extends Specification {

    private V1WorkspaceService workspaceService

    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)

    User user = new User(UUID.randomUUID().toString(), "Jon Snow", "email", "http://test.com/bastard.png", false, LocalDateTime.now())

    Workspace workspace = new Workspace(
            UUID.randomUUID().toString(),
            "workspace",
            LocalDateTime.now(),
            [],
            user,
            "2510666a-6d1d-46a1-a4e3-2d3e6087a919",
            "dfff8ca9-b2a4-4c01-9d0f-e54597c7c571",
            "cee485b8-95d2-4738-99c3-0c0c0c1c61bb",
            "82cea34c-8d3e-4705-aac5-941c5da0b1f0"
    )

    def setup() {
        workspaceService = new V1WorkspaceService(workspaceRepository)
    }

    def "should return all workspaces on findAll"() {

        given:
        def pageable = PageRequest.of(0, 1)

        when:
        def page = workspaceService.findAll(pageable)

        then:
        1 * workspaceRepository.findAll(pageable) >> new PageImpl<>([workspace], pageable, 1)
        page != null
        page.content != null
        page.content.size() == 1
        page.page == 0
        page.last
        page.totalPages == 1

    }

    def "should not return workspaces on findAll"() {

        given:
        def pageable = PageRequest.of(0, 1)

        when:
        def page = workspaceService.findAll(pageable)

        then:
        1 * workspaceRepository.findAll(pageable) >> new PageImpl<>([], pageable, 1)
        page != null
        page.content != null
        page.content.size() == 0
        page.page == 0
        page.last
        page.totalPages == 1

    }
}
