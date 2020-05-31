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

package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import org.springframework.jdbc.core.ResultSetExtractor
import java.sql.ResultSet
import org.springframework.stereotype.Component as SpringComponent

@SpringComponent
class ModuleExtractor(private val moduleMapper: ModuleMapper) : ResultSetExtractor<Set<Module>> {

    override fun extractData(resultSet: ResultSet): Set<Module> {
        val modules = HashSet<Module>()
        val components = HashSet<Component>()

        while (resultSet.next()) {
            createModules(resultSet, modules)
            createComponents(resultSet, components)
        }

        return composeModules(modules, components)
    }

    private fun composeModules(
        modules: HashSet<Module>,
        components: HashSet<Component>
    ): Set<Module> {
        return modules.map { module ->
            module.copy(components = components.filter { component ->
                component.moduleId == module.id
            })
        }.toHashSet()
    }

    private fun createModules(resultSet: ResultSet, modules: HashSet<Module>) {
        modules.add(this.moduleMapper.mapModule(resultSet))
    }

    private fun createComponents(resultSet: ResultSet, components: HashSet<Component>) {
        if (resultSet.getString("component_id") != null) {
            components.add(moduleMapper.mapComponent(resultSet))
        }
    }
}
