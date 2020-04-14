/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.Component
import br.com.zup.charles.domain.Module
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
        components.add(moduleMapper.mapComponent(resultSet))
    }
}