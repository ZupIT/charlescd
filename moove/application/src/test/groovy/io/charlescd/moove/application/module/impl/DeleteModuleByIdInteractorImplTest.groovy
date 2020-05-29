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

package io.charlescd.moove.application.module.impl

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.application.module.DeleteModuleByIdInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteModuleByIdInteractorImplTest extends Specification {

    private DeleteModuleByIdInteractor deleteModuleByIdInteractor

    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        deleteModuleByIdInteractor = new DeleteModuleByIdInteractorImpl(new ModuleService(moduleRepository))
    }

    def "should delete a module by its Id"() {
        given:
        def moduleId = "8c5363e5-8cb5-429f-8036-1744d4c28349"
        def workspaceId = "db02e690-d3a8-4c54-b953-77840e40e868"

        def author = new User("81861b6f-2b6e-44a1-a745-83e298a550c9", "John Doe", "email@gmail.com",
                "https://www.photos.com/johndoe", [], false, LocalDateTime.now())

        def gitCredentials = new GitCredentials("address", "username", "password",
                null, GitServiceProvider.GITHUB)

        def gitConfiguration = new GitConfiguration("8f140b14-886d-4063-a245-eed09a1ff762", "config", gitCredentials,
                LocalDateTime.now(), author, workspaceId)

        def component = new Component("0e6fbc62-41e5-461a-ba11-1765b5d17776", moduleId, "component", LocalDateTime.now(),
                workspaceId, 10, 10)

        def module = new Module(moduleId, "Villager", "gitRepositoryAddress",
                LocalDateTime.now(), "helm-repository", author,
                [], gitConfiguration, [component], workspaceId)

        when:
        deleteModuleByIdInteractor.execute(moduleId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.of(module)

        1 * moduleRepository.delete(moduleId, workspaceId)
    }

    def "should throw an exception when module does not exists"() {
        given:
        def moduleId = "8c5363e5-8cb5-429f-8036-1744d4c28349"
        def workspaceId = "db02e690-d3a8-4c54-b953-77840e40e868"

        when:
        deleteModuleByIdInteractor.execute(moduleId, workspaceId)

        then:
        1 * moduleRepository.find(moduleId, workspaceId) >> Optional.empty()

        0 * moduleRepository.delete(_, _)

        def exception = thrown(NotFoundException)
        assert exception.resourceName == "module"
        assert exception.id == moduleId
    }
}
