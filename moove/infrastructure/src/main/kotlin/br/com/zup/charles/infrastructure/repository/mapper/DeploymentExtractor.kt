/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.ResultSetExtractor
import java.sql.ResultSet

class DeploymentExtractor : ResultSetExtractor<Set<Deployment>> {

    override fun extractData(resultSet: ResultSet): Set<Deployment> {
        val deployments = HashSet<Deployment>()

        while (resultSet.next()) {
            deployments.add(mapDeployment(resultSet))
        }

        return deployments
    }

    private fun mapDeployment(resultSet: ResultSet) = Deployment(
        id = resultSet.getString("deployment_id"),
        author = mapDeploymentUser(resultSet),
        createdAt = resultSet.getTimestamp("deployment_created_at").toLocalDateTime(),
        deployedAt = resultSet.getTimestamp("deployment_deployed_at")?.toLocalDateTime(),
        status = DeploymentStatusEnum.valueOf(resultSet.getString("deployment_status")),
        circle = mapDeploymentCircle(resultSet),
        buildId = resultSet.getString("deployment_build_id"),
        applicationId = resultSet.getString("deployment_application_id")
    )

    private fun mapDeploymentUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_user_id"),
        name = resultSet.getString("deployment_user_name"),
        email = resultSet.getString("deployment_user_email"),
        photoUrl = resultSet.getString("deployment_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_user_created_at").toLocalDateTime()
    )

    private fun mapDeploymentCircle(resultSet: ResultSet) = Circle(
        id = resultSet.getString("deployment_circle_id"),
        name = resultSet.getString("deployment_circle_name"),
        reference = resultSet.getString("deployment_circle_reference"),
        author = mapDeploymentCircleUser(resultSet),
        createdAt = resultSet.getTimestamp("deployment_circle_created_at").toLocalDateTime(),
        matcherType = MatcherTypeEnum.valueOf(resultSet.getString("deployment_circle_matcher_type")),
        rules = ObjectMapper().readTree(resultSet.getString("deployment_circle_rules")),
        importedKvRecords = resultSet.getInt("deployment_circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("deployment_circle_imported_at")?.toLocalDateTime()
    )

    private fun mapDeploymentCircleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_circle_user_id"),
        name = resultSet.getString("deployment_circle_user_name"),
        email = resultSet.getString("deployment_circle_user_email"),
        photoUrl = resultSet.getString("deployment_circle_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_circle_user_created_at").toLocalDateTime()
    )
}