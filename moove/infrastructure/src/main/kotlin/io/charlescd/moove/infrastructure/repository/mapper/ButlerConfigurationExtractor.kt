package io.charlescd.moove.infrastructure.repository.mapper

import io.charlescd.moove.domain.ButlerConfiguration
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class ButlerConfigurationExtractor(private val butlerConfigurationMapper: ButlerConfigurationMapper) :
    ResultSetExtractor<Set<ButlerConfiguration>> {

    override fun extractData(resultSet: ResultSet): Set<ButlerConfiguration> {
        val configurations = HashSet<ButlerConfiguration>()

        while (resultSet.next()) {
            butlerConfigurationMapper.mapButlerConfiguration(resultSet)?.let { configurations.add(it) }
        }

        return configurations
    }
}
