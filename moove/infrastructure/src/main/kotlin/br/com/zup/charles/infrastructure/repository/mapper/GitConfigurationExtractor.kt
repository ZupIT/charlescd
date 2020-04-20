/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.GitConfiguration
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class GitConfigurationExtractor(private val gitConfigurationMapper: GitConfigurationMapper) :
    ResultSetExtractor<Set<GitConfiguration>> {

    override fun extractData(resultSet: ResultSet): Set<GitConfiguration> {
        val configurations = HashSet<GitConfiguration>()

        while (resultSet.next()) {
            configurations.add(gitConfigurationMapper.mapGitConfiguration(resultSet))
        }

        return configurations
    }
}