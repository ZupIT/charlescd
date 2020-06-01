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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.KeyValueRule
import io.charlescd.moove.domain.repository.KeyValueRuleRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.PreparedStatement
import java.sql.Types

@Repository
class JdbcKeyValueRuleRepository(private val jdbcTemplate: JdbcTemplate) : KeyValueRuleRepository {

    override fun saveAll(rules: List<KeyValueRule>) {
        createKeyValueRules(rules)
    }

    override fun delete(circleId: String) {
        deleteRulesByCircleId(circleId)
    }

    private fun createKeyValueRules(rules: List<KeyValueRule>) {
        val statement = "INSERT INTO key_value_rules(id,rule,circle_id) VALUES(?, ?, ?)"

        this.jdbcTemplate.batchUpdate(statement, rules, rules.size) { ps: PreparedStatement, rule: KeyValueRule ->
            ps.setString(1, rule.id)
            ps.setObject(2, rule.rule, Types.OTHER)
            ps.setString(3, rule.circleId)
        }
    }

    private fun deleteRulesByCircleId(circleId: String) {
        val statement = "DELETE FROM key_value_rules WHERE circle_id = ?"

        this.jdbcTemplate.update(statement, circleId)
    }
}
