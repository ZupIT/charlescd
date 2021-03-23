package io.charlescd.moove.infrastructure.repository.mapper

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.KeyValueRule
import java.sql.ResultSet
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component

@Component
class KeyValueExtractor(private val objectMapper: ObjectMapper) : ResultSetExtractor<Set<KeyValueRule>> {

    override fun extractData(resultSet: ResultSet): Set<KeyValueRule> {
        val keyValues = HashSet<KeyValueRule>()

        while (resultSet.next()) {
            keyValues.add(mapKeyValue(resultSet))
        }

        return keyValues
    }

    private fun mapKeyValue(resultSet: ResultSet) = KeyValueRule(
        id = resultSet.getString("key_value_id"),
        rule = objectMapper.readTree(resultSet.getString("key_value_rule")),
        circleId = resultSet.getString("key_value_circle_id")
    )
}
