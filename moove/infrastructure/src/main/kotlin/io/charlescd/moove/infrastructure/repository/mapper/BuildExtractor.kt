/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.infrastructure.repository.mapper

import com.fasterxml.jackson.databind.ObjectMapper
import io.charlescd.moove.domain.*
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
        workspaceId = resultSet.getString("build_workspace_id"),
        deployments = emptyList()
    )

    private fun mapBuildUser(resultSet: ResultSet) = User(
        id = resultSet.getString("build_user_id"),
        name = resultSet.getString("build_user_name"),
        email = resultSet.getString("build_user_email"),
        photoUrl = resultSet.getString("build_user_photo_url"),
        workspaces = emptyList(),
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
        workspaceId = resultSet.getString("module_snapshot_workspace_id"),
        featureSnapshotId = resultSet.getString("module_snapshot_feature_snapshot_id")
    )

    private fun mapComponentSnapshot(resultSet: ResultSet) = ComponentSnapshot(
        id = resultSet.getString("component_snapshot_id"),
        componentId = resultSet.getString("component_snapshot_component_id"),
        name = resultSet.getString("component_snapshot_name"),
        createdAt = resultSet.getTimestamp("component_snapshot_created_at").toLocalDateTime(),
        artifact = resultSet.getString("artifact_snapshot_id")?.let { mapArtifactSnapshot(resultSet) },
        workspaceId = resultSet.getString("component_snapshot_workspace_id"),
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
        workspaceId = resultSet.getString("deployment_workspace_id")
    )

    private fun mapDeploymentUser(resultSet: ResultSet) = User(
        id = resultSet.getString("deployment_user_id"),
        name = resultSet.getString("deployment_user_name"),
        email = resultSet.getString("deployment_user_email"),
        photoUrl = resultSet.getString("deployment_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("deployment_user_created_at").toLocalDateTime()
    )

    private fun mapCircle(resultSet: ResultSet) = Circle(
        id = resultSet.getString("circle_id"),
        name = resultSet.getString("circle_name"),
        reference = resultSet.getString("circle_reference"),
        author = mapCircleUser(resultSet),
        createdAt = resultSet.getTimestamp("circle_created_at").toLocalDateTime(),
        matcherType = MatcherTypeEnum.valueOf(resultSet.getString("circle_matcher_type")),
        rules = resultSet.getString("circle_rules")?.let { objectMapper.readTree(it) },
        importedKvRecords = resultSet.getInt("circle_imported_kv_records"),
        importedAt = resultSet.getTimestamp("circle_imported_at")?.toLocalDateTime(),
        defaultCircle = resultSet.getBoolean("circle_default_circle"),
        workspaceId = resultSet.getString("circle_workspace_id")
    )

    private fun mapCircleUser(resultSet: ResultSet) = User(
        id = resultSet.getString("circle_user_id"),
        name = resultSet.getString("circle_user_name"),
        email = resultSet.getString("circle_user_email"),
        photoUrl = resultSet.getString("circle_user_photo_url"),
        workspaces = emptyList(),
        createdAt = resultSet.getTimestamp("circle_user_created_at").toLocalDateTime()
    )
}
