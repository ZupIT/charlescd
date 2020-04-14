/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository.mapper

import br.com.zup.charles.domain.*
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.jdbc.core.ResultSetExtractor
import org.springframework.stereotype.Component
import java.sql.ResultSet

@Component
class BuildExtractor(private val objectMapper: ObjectMapper) : ResultSetExtractor<Set<Build>> {

    override fun extractData(resultSet: ResultSet): Set<Build> {
        val builds = HashSet<Build>()
        val deployments = HashSet<Deployment>()
        val features = HashSet<FeatureSnapshot>()
        val modules = HashSet<ModuleSnapshot>()
        val components = HashSet<ComponentSnapshot>()

        while (resultSet.next()) {
            builds.add(mapBuild(resultSet))
            createFeatures(resultSet, features)
            createModules(resultSet, modules)
            createComponents(resultSet, components)
            createDeployments(resultSet, deployments)
        }

        return composeBuilds(
            builds,
            composeFeatures(features, composeModules(modules, components)),
            deployments
        )
    }

    private fun createDeployments(
        resultSet: ResultSet,
        deployments: HashSet<Deployment>
    ) {
        if (resultSet.getString("deployment_id") != null) {
            deployments.add(mapDeployment(resultSet))
        }
    }

    private fun createComponents(
        resultSet: ResultSet,
        components: HashSet<ComponentSnapshot>
    ) {
        if (resultSet.getString("component_snapshot_id") != null) {
            components.add(mapComponentSnapshot(resultSet))
        }
    }

    private fun createModules(
        resultSet: ResultSet,
        modules: HashSet<ModuleSnapshot>
    ) {
        if (resultSet.getString("module_snapshot_id") != null) {
            modules.add(mapModuleSnapshot(resultSet))
        }
    }

    private fun createFeatures(
        resultSet: ResultSet,
        features: HashSet<FeatureSnapshot>
    ) {
        if (resultSet.getString("feature_snapshot_id") != null) {
            features.add(mapFeature(resultSet))
        }
    }

    private fun composeBuilds(
        builds: HashSet<Build>,
        features: HashSet<FeatureSnapshot>,
        deployments: HashSet<Deployment>
    ): HashSet<Build> {
        return builds.map {
            it.copy(
                features = features.toList(),
                deployments = deployments.toList()
            )
        }.toHashSet()
    }

    private fun composeFeatures(
        features: HashSet<FeatureSnapshot>,
        modules: HashSet<ModuleSnapshot>
    ): HashSet<FeatureSnapshot> {
        return features.map {
            it.copy(modules = modules.filter { m ->
                m.featureSnapshotId == it.id
            })
        }.toHashSet()
    }

    private fun composeModules(
        modules: HashSet<ModuleSnapshot>,
        components: HashSet<ComponentSnapshot>
    ): HashSet<ModuleSnapshot> {
        return modules.map {
            it.copy(components = components.filter { c ->
                c.moduleSnapshotId == it.id
            })
        }.toHashSet()
    }

    private fun mapBuild(resultSet: ResultSet) = Build(
        id = resultSet.getString("build_id"),
        author = mapBuildUser(resultSet),
        createdAt = resultSet.getTimestamp("build_created_at").toLocalDateTime(),
        features = emptyList(),
        tag = resultSet.getString("build_tag"),
        columnId = resultSet.getString("build_card_column_id"),
        hypothesisId = resultSet.getString("build_hypothesis_id"),
        status = BuildStatusEnum.valueOf(resultSet.getString("build_status")),
        applicationId = resultSet.getString("build_application_id"),
        deployments = emptyList()
    )

    private fun mapBuildUser(resultSet: ResultSet) = User(
        id = resultSet.getString("build_user_id"),
        name = resultSet.getString("build_user_name"),
        email = resultSet.getString("build_user_email"),
        photoUrl = resultSet.getString("build_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("build_user_created_at").toLocalDateTime()
    )

    private fun mapFeature(resultSet: ResultSet) = FeatureSnapshot(
        id = resultSet.getString("feature_snapshot_id"),
        featureId = resultSet.getString("feature_snapshot_feature_id"),
        name = resultSet.getString("feature_snapshot_name"),
        branchName = resultSet.getString("feature_snapshot_branch_name"),
        createdAt = resultSet.getTimestamp("feature_snapshot_created_at").toLocalDateTime(),
        authorName = resultSet.getString("feature_snapshot_author_name"),
        modules = emptyList(),
        authorId = resultSet.getString("feature_snapshot_author_id"),
        buildId = resultSet.getString("feature_snapshot_build_id")
    )

    private fun mapModuleSnapshot(resultSet: ResultSet) = ModuleSnapshot(
        id = resultSet.getString("module_snapshot_id"),
        moduleId = resultSet.getString("module_snapshot_module_id"),
        name = resultSet.getString("module_snapshot_name"),
        gitRepositoryAddress = resultSet.getString("module_snapshot_git_repository_address"),
        createdAt = resultSet.getTimestamp("module_snapshot_created_at").toLocalDateTime(),
        helmRepository = resultSet.getString("module_snapshot_helm_repository"),
        components = emptyList(),
        applicationId = resultSet.getString("module_snapshot_application_id"),
        featureSnapshotId = resultSet.getString("module_snapshot_feature_snapshot_id"),
        gitConfigurationId = resultSet.getString("module_snapshot_git_configuration_id"),
        registryConfigurationId = resultSet.getString("module_snapshot_registry_configuration_id"),
        cdConfigurationId = resultSet.getString("module_snapshot_cd_configuration_id")
    )

    private fun mapComponentSnapshot(resultSet: ResultSet) = ComponentSnapshot(
        id = resultSet.getString("component_snapshot_id"),
        componentId = resultSet.getString("component_snapshot_component_id"),
        name = resultSet.getString("component_snapshot_name"),
        contextPath = resultSet.getString("component_snapshot_context_path"),
        port = resultSet.getInt("component_snapshot_port"),
        healthCheck = resultSet.getString("component_snapshot_health_check"),
        createdAt = resultSet.getTimestamp("component_snapshot_created_at").toLocalDateTime(),
        artifact = resultSet.getString("artifact_snapshot_id")?.let { mapArtifactSnapshot(resultSet) },
        applicationId = resultSet.getString("component_snapshot_application_id"),
        moduleSnapshotId = resultSet.getString("component_snapshot_module_snapshot_id")
    )

    private fun mapArtifactSnapshot(resultSet: ResultSet) = ArtifactSnapshot(
        id = resultSet.getString("artifact_snapshot_id"),
        artifact = resultSet.getString("artifact_snapshot_artifact"),
        version = resultSet.getString("artifact_snapshot_version"),
        componentSnapshotId = resultSet.getString("artifact_snapshot_component_snapshot_id"),
        createdAt = resultSet.getTimestamp("artifact_snapshot_created_at").toLocalDateTime()
    )

    private fun mapDeployment(resultSet: ResultSet) = Deployment(
        id = resultSet.getString("deployment_id"),
        author = mapDeploymentUser(resultSet),
        createdAt = resultSet.getTimestamp("deployment_created_at").toLocalDateTime(),
        deployedAt = resultSet.getTimestamp("deployment_deployed_at")?.toLocalDateTime(),
        status = DeploymentStatusEnum.valueOf(resultSet.getString("deployment_status")),
        circle = mapCircle(resultSet),
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

    private fun mapCircle(resultSet: ResultSet) = Circle(
        id = resultSet.getString("circle_id"),
        name = resultSet.getString("circle_name"),
        reference = resultSet.getString("circle_reference"),
        author = mapCircleUser(resultSet),
        createdAt = resultSet.getTimestamp("circle_created_at").toLocalDateTime(),
        matcherType = MatcherTypeEnum.valueOf(resultSet.getString("circle_matcher_type")),
        rules = objectMapper.readTree(resultSet.getString("circle_rules")),
        importedKvRecords = resultSet.getInt("circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("circle_imported_at")?.toLocalDateTime()
    )

    private fun mapCircleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("circle_user_id"),
        name = resultSet.getString("circle_user_name"),
        email = resultSet.getString("circle_user_email"),
        photoUrl = resultSet.getString("circle_user_photo_url"),
        applications = emptyList(),
        createdAt = resultSet.getTimestamp("circle_user_created_at").toLocalDateTime()
    )
}
