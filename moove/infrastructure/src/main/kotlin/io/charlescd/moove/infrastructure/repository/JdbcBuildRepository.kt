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

package io.charlescd.moove.infrastructure.repository

import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.infrastructure.repository.mapper.BuildExtractor
import java.util.*
import kotlin.collections.LinkedHashMap
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class JdbcBuildRepository(private val jdbcTemplate: JdbcTemplate, private val buildExtractor: BuildExtractor) :
    BuildRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
            SELECT builds.id                                AS build_id,
                   builds.created_at                        AS build_created_at,
                   builds.tag                               AS build_tag,
                   builds.card_column_id                    AS build_card_column_id,
                   builds.hypothesis_id                     AS build_hypothesis_id,
                   builds.status                            AS build_status,
                   builds.workspace_id                      AS build_workspace_id,
                   build_user.id                            AS build_user_id,
                   build_user.name                          AS build_user_name,
                   build_user.email                         AS build_user_email,
                   build_user.photo_url                     AS build_user_photo_url,
                   build_user.created_at                    AS build_user_created_at,
                   feature_snapshots.id                     AS feature_snapshot_id,
                   feature_snapshots.feature_id             AS feature_snapshot_feature_id,
                   feature_snapshots.name                   AS feature_snapshot_name,
                   feature_snapshots.branch_name            AS feature_snapshot_branch_name,
                   feature_snapshots.created_at             AS feature_snapshot_created_at,
                   feature_snapshots.author_name            AS feature_snapshot_author_name,
                   feature_snapshots.author_id              AS feature_snapshot_author_id,
                   feature_snapshots.build_id               AS feature_snapshot_build_id,
                   module_snapshots.id                      AS module_snapshot_id,
                   module_snapshots.module_id               AS module_snapshot_module_id,
                   module_snapshots.name                    AS module_snapshot_name,
                   module_snapshots.git_repository_address  AS module_snapshot_git_repository_address,
                   module_snapshots.created_at              AS module_snapshot_created_at,
                   module_snapshots.helm_repository         AS module_snapshot_helm_repository,
                   module_snapshots.workspace_id            AS module_snapshot_workspace_id,
                   module_snapshots.feature_snapshot_id     AS module_snapshot_feature_snapshot_id,
                   component_snapshots.id                   AS component_snapshot_id,
                   component_snapshots.component_id         AS component_snapshot_component_id,
                   component_snapshots.name                 AS component_snapshot_name,
                   component_snapshots.created_at           AS component_snapshot_created_at,
                   component_snapshots.workspace_id         AS component_snapshot_workspace_id,
                   component_snapshots.module_snapshot_id   AS component_snapshot_module_snapshot_id,
                   component_snapshots.host_value           AS component_snapshot_host_value,
                   component_snapshots.gateway_name         AS component_snapshot_gateway_name, 
                   artifact_snapshots.id                    AS artifact_snapshot_id,
                   artifact_snapshots.artifact              AS artifact_snapshot_artifact,
                   artifact_snapshots.version               AS artifact_snapshot_version,
                   artifact_snapshots.component_snapshot_id AS artifact_snapshot_component_snapshot_id,
                   artifact_snapshots.created_at            AS artifact_snapshot_created_at,
                   deployments.id                           AS deployment_id,
                   deployments.created_at                   AS deployment_created_at,
                   deployments.deployed_at                  AS deployment_deployed_at,
                   deployments.status                       AS deployment_status,
                   deployments.circle_id                    AS deployment_circle_id,
                   deployments.build_id                     AS deployment_build_id,
                   deployments.workspace_id                 AS deployment_workspace_id,
                   deployment_user.id                       AS deployment_user_id,
                   deployment_user.name                     AS deployment_user_name,
                   deployment_user.email                    AS deployment_user_email,
                   deployment_user.photo_url                AS deployment_user_photo_url,
                   deployment_user.created_at               AS deployment_user_created_at,
                   circles.id                               AS circle_id,
                   circles.name                             AS circle_name,
                   circles.reference                        AS circle_reference,
                   circles.created_at                       AS circle_created_at,
                   circles.matcher_type                     AS circle_matcher_type,
                   circles.default_circle                   AS circle_default_circle,
                   circles.rules                            AS circle_rules,
                   circles.imported_kv_records              AS circle_imported_kv_records,
                   circles.imported_at                      AS circle_imported_at,
                   circles.workspace_id                     AS circle_workspace_id,
                   circle_user.id                           AS circle_user_id,
                   circle_user.name                         AS circle_user_name,
                   circle_user.email                        AS circle_user_email,
                   circle_user.photo_url                    AS circle_user_photo_url,
                   circle_user.created_at                   AS circle_user_created_at
            FROM builds
                     INNER JOIN users build_user ON builds.user_id = build_user.id
                     LEFT JOIN feature_snapshots ON builds.id = feature_snapshots.build_id
                     LEFT JOIN module_snapshots ON feature_snapshots.id = module_snapshots.feature_snapshot_id
                     LEFT JOIN component_snapshots ON module_snapshots.id = component_snapshots.module_snapshot_id
                     LEFT JOIN artifact_snapshots ON component_snapshots.id = artifact_snapshots.component_snapshot_id
                     LEFT JOIN deployments ON builds.id = deployments.build_id
                     LEFT JOIN users deployment_user ON deployments.user_id = deployment_user.id
                     LEFT JOIN circles ON deployments.circle_id = circles.id
                     LEFT JOIN users circle_user ON circles.user_id = circle_user.id
            WHERE 1 = 1
          """
    }

    override fun save(build: Build): Build {
        createBuild(build)

        createLegacyRelationship(build)

        createFeatures(build)

        createModules(build)

        createComponents(build)

        createArtifacts(build)

        return find(build.id, build.workspaceId).get()
    }

    override fun delete(build: Build) {
        deleteArtifacts(build)

        deleteComponents(build)

        deleteModules(build)

        deleteFeatures(build)

        deleteDeployments(build)

        deleteBuild(build)
    }

    override fun saveArtifacts(artifacts: List<ArtifactSnapshot>) {
        createArtifactSnapshots(artifacts)
    }

    override fun updateStatus(id: String, status: BuildStatusEnum) {
        updateBuildStatus(status, id)
    }

    override fun findById(id: String): Optional<Build> {
        return findBuildById(id)
    }

    override fun find(id: String, workspaceId: String): Optional<Build> {
        return findByIdAndWorkspaceId(id, workspaceId)
    }

    override fun find(tag: String?, status: BuildStatusEnum?, workspaceId: String, page: PageRequest): Page<Build> {
        return this.findByParameters(
            createParametersMap(tag, status, workspaceId),
            page
        )
    }

    private fun createLegacyRelationship(build: Build) {
        val statement = "INSERT INTO builds_features(" +
                "build_id," +
                "feature_id)" +
                "VALUES(?,?)"

        this.jdbcTemplate.batchUpdate(
            statement,
            build.features.map {
                arrayOf(
                    build.id,
                    it.featureId
                )
            }
        )
    }

    private fun findBuildById(id: String): Optional<Build> {
        return Optional.ofNullable(
            findByParameters(
                mapOf("id" to id),
                PageRequest()
            ).content.firstOrNull()
        )
    }

    private fun createArtifactSnapshots(artifacts: List<ArtifactSnapshot>) {
        if (artifacts.isNotEmpty()) {
            val statement = "INSERT INTO artifact_snapshots(" +
                    "id," +
                    "artifact," +
                    "version," +
                    "created_at," +
                    "component_snapshot_id)" +
                    "VALUES(?,?,?,?,?)"

            this.jdbcTemplate.batchUpdate(
                statement,
                artifacts.map {
                    arrayOf(
                        it.id,
                        it.artifact,
                        it.version,
                        it.createdAt,
                        it.componentSnapshotId
                    )
                }
            )
        }
    }

    private fun createFeatures(build: Build) {
        if (build.features.isNotEmpty()) {
            val statement = "INSERT INTO feature_snapshots(" +
                    "id," +
                    "feature_id," +
                    "name," +
                    "branch_name," +
                    "created_at," +
                    "author_name," +
                    "author_id," +
                    "build_id) VALUES(" +
                    "?,?,?,?,?,?,?,?)"

            this.jdbcTemplate.batchUpdate(
                statement,
                build.features.map {
                    arrayOf(
                        it.id,
                        it.featureId,
                        it.name,
                        it.branchName,
                        it.createdAt,
                        it.authorName,
                        it.authorId,
                        build.id
                    )
                }
            )
        }
    }

    private fun createModules(build: Build) {
        val modules = build.modules()

        if (modules.isNotEmpty()) {
            val statement = "INSERT INTO module_snapshots(" +
                    "id," +
                    "module_id," +
                    "name," +
                    "git_repository_address," +
                    "created_at," +
                    "helm_repository," +
                    "workspace_id," +
                    "feature_snapshot_id) VALUES(" +
                    "?,?,?,?,?,?,?,?)"

            this.jdbcTemplate.batchUpdate(
                statement,
                modules.map {
                    arrayOf(
                        it.id,
                        it.moduleId,
                        it.name,
                        it.gitRepositoryAddress,
                        it.createdAt,
                        it.helmRepository,
                        it.workspaceId,
                        it.featureSnapshotId
                    )
                }
            )
        }
    }

    private fun createComponents(build: Build) {
        val components = build.components()

        if (components.isNotEmpty()) {
            val statement = "INSERT INTO component_snapshots(" +
                    "id," +
                    "component_id," +
                    "name," +
                    "created_at," +
                    "workspace_id," +
                    "module_snapshot_id," +
                    "host_value," +
                    "gateway_name) VALUES(" +
                    "?,?,?,?,?,?,?,?)"

            this.jdbcTemplate.batchUpdate(
                statement,
                components.map {
                    arrayOf(
                        it.id,
                        it.componentId,
                        it.name,
                        it.createdAt,
                        it.workspaceId,
                        it.moduleSnapshotId,
                        it.hostValue,
                        it.gatewayName
                    )
                }
            )
        }
    }

    private fun createArtifacts(build: Build) {
        createArtifactSnapshots(build.artifacts())
    }

    private fun createBuild(build: Build) {
        val statement = "INSERT INTO builds(" +
                "id," +
                "user_id," +
                "created_at," +
                "tag," +
                "card_column_id," +
                "hypothesis_id," +
                "status," +
                "workspace_id) VALUES(" +
                "?,?,?,?,?,?,?,?)"

        this.jdbcTemplate.update(
            statement,
            build.id,
            build.author.id,
            build.createdAt,
            build.tag,
            build.columnId,
            build.hypothesisId,
            build.status.name,
            build.workspaceId
        )
    }

    private fun findByIdAndWorkspaceId(id: String, workspaceId: String): Optional<Build> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("AND builds.id = ?")
            .appendln("AND builds.workspace_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id, workspaceId), buildExtractor)?.firstOrNull()
        )
    }

    private fun createParametersMap(
        tag: String?,
        status: BuildStatusEnum?,
        workspaceId: String
    ): Map<String, String> {
        val parameters = LinkedHashMap<String, String>()

        tag?.apply {
            parameters["tag"] = "%$this%"
        }

        status?.apply {
            parameters["status"] = status.name
        }

        parameters["workspace_id"] = workspaceId

        return parameters
    }

    private fun findByParameters(parameters: Map<String, String>, pageRequest: PageRequest): Page<Build> {
        val count = executeCountQuery(createCountQuery(parameters), parameters)

        val result = this.jdbcTemplate.query(
            createQueryStatement(parameters, pageRequest),
            parameters.values.toTypedArray(),
            buildExtractor
        )

        return Page(result?.toList() ?: emptyList(), pageRequest.page, pageRequest.size, count ?: 0)
    }

    private fun createInnerQueryStatement(
        parameters: Map<String, String>,
        pageRequest: PageRequest
    ): String {
        val innerQuery = StringBuilder("SELECT * FROM builds WHERE 1 = 1")

        parameters.forEach { (k, _) -> appendWhereParameters(k, innerQuery) }

        return innerQuery
            .appendln("LIMIT ${pageRequest.size}")
            .appendln("OFFSET ${pageRequest.offset()}")
            .toString()
    }

    private fun executeCountQuery(
        countStatement: String,
        parameters: Map<String, String>
    ): Int? {
        return this.jdbcTemplate.queryForObject(
            countStatement,
            parameters.values.toTypedArray()
        ) { rs, _ ->
            rs.getInt(1)
        }
    }

    private fun createCountQuery(parameters: Map<String, String>): String {
        val statement = StringBuilder(
            """
                SELECT count(*)
                FROM builds WHERE 1 = 1
                """
        )

        parameters.forEach { (k, _) -> appendWhereParameters(k, statement) }

        return statement.toString()
    }

    private fun appendWhereParameters(parameter: String, query: StringBuilder) {
        when (parameter) {
            "tag" -> query.appendln("AND builds.$parameter ILIKE ?")
            else -> query.appendln("AND builds.$parameter = ?")
        }
    }

    private fun deleteBuild(build: Build) {
        val statement = "DELETE FROM builds WHERE id = ?"
        this.jdbcTemplate.update(statement, build.id)
    }

    private fun deleteArtifacts(build: Build) {
        val statement = "DELETE FROM artifact_snapshots WHERE id = ?"
        val artifacts = build.artifacts()
        this.jdbcTemplate.batchUpdate(
            statement,
            artifactIdArray(artifacts)
        )
    }

    private fun deleteComponents(build: Build) {
        val statement = "DELETE FROM component_snapshots WHERE id = ?"
        val components = build.components()
        this.jdbcTemplate.batchUpdate(
            statement,
            componentIdArray(components)
        )
    }

    private fun deleteModules(build: Build) {
        val statement = "DELETE FROM module_snapshots WHERE id = ?"
        val modules = build.modules()
        this.jdbcTemplate.batchUpdate(
            statement,
            moduleIdArray(modules)
        )
    }

    private fun deleteFeatures(build: Build) {
        val statement = "DELETE FROM feature_snapshots WHERE id = ?"
        this.jdbcTemplate.batchUpdate(
            statement,
            featureIdArray(build)
        )
    }

    private fun deleteDeployments(build: Build) {
        val statement = "DELETE FROM deployments WHERE id = ?"
        this.jdbcTemplate.batchUpdate(
            statement,
            deploymentIdArray(build)
        )
    }

    private fun updateBuildStatus(status: BuildStatusEnum, id: String) {
        val statement = "UPDATE builds SET status = ? WHERE id = ?"
        this.jdbcTemplate.update(statement, status.name, id)
    }

    private fun artifactIdArray(artifacts: List<ArtifactSnapshot?>) =
        artifacts.map { artifact ->
            arrayOf(artifact?.id)
        }

    private fun deploymentIdArray(build: Build) =
        build.deployments.map { deployment ->
            arrayOf(deployment.id)
        }

    private fun featureIdArray(build: Build) =
        build.features.map { feature ->
            arrayOf(feature.id)
        }

    private fun moduleIdArray(modules: List<ModuleSnapshot>) =
        modules.map { module ->
            arrayOf(module.id)
        }

    private fun componentIdArray(components: List<ComponentSnapshot>) =
        components.map { component ->
            arrayOf(component.id)
        }

    private fun createQueryStatement(
        parameters: Map<String, String>,
        pageRequest: PageRequest
    ): String {
        val innerQueryStatement = createInnerQueryStatement(parameters, pageRequest)
        return """
            SELECT builds.id                                AS build_id,
                   builds.created_at                        AS build_created_at,
                   builds.tag                               AS build_tag,
                   builds.card_column_id                    AS build_card_column_id,
                   builds.hypothesis_id                     AS build_hypothesis_id,
                   builds.status                            AS build_status,
                   builds.workspace_id                      AS build_workspace_id,
                   build_user.id                            AS build_user_id,
                   build_user.name                          AS build_user_name,
                   build_user.email                         AS build_user_email,
                   build_user.photo_url                     AS build_user_photo_url,
                   build_user.created_at                    AS build_user_created_at,
                   feature_snapshots.id                     AS feature_snapshot_id,
                   feature_snapshots.feature_id             AS feature_snapshot_feature_id,
                   feature_snapshots.name                   AS feature_snapshot_name,
                   feature_snapshots.branch_name            AS feature_snapshot_branch_name,
                   feature_snapshots.created_at             AS feature_snapshot_created_at,
                   feature_snapshots.author_name            AS feature_snapshot_author_name,
                   feature_snapshots.author_id              AS feature_snapshot_author_id,
                   feature_snapshots.build_id               AS feature_snapshot_build_id,
                   module_snapshots.id                      AS module_snapshot_id,
                   module_snapshots.module_id               AS module_snapshot_module_id,
                   module_snapshots.name                    AS module_snapshot_name,
                   module_snapshots.git_repository_address  AS module_snapshot_git_repository_address,
                   module_snapshots.created_at              AS module_snapshot_created_at,
                   module_snapshots.helm_repository         AS module_snapshot_helm_repository,
                   module_snapshots.workspace_id            AS module_snapshot_workspace_id,
                   module_snapshots.feature_snapshot_id     AS module_snapshot_feature_snapshot_id,
                   component_snapshots.id                   AS component_snapshot_id,
                   component_snapshots.component_id         AS component_snapshot_component_id,
                   component_snapshots.name                 AS component_snapshot_name,
                   component_snapshots.created_at           AS component_snapshot_created_at,
                   component_snapshots.workspace_id         AS component_snapshot_workspace_id,
                   component_snapshots.module_snapshot_id   AS component_snapshot_module_snapshot_id,
                   component_snapshots.host_value           AS component_snapshot_host_value,
                   component_snapshots.gateway_name         AS component_snapshot_gateway_name,
                   artifact_snapshots.id                    AS artifact_snapshot_id,
                   artifact_snapshots.artifact              AS artifact_snapshot_artifact,
                   artifact_snapshots.version               AS artifact_snapshot_version,
                   artifact_snapshots.component_snapshot_id AS artifact_snapshot_component_snapshot_id,
                   artifact_snapshots.created_at            AS artifact_snapshot_created_at,
                   deployments.id                           AS deployment_id,
                   deployments.created_at                   AS deployment_created_at,
                   deployments.deployed_at                  AS deployment_deployed_at,
                   deployments.status                       AS deployment_status,
                   deployments.circle_id                    AS deployment_circle_id,
                   deployments.build_id                     AS deployment_build_id,
                   deployments.workspace_id                 AS deployment_workspace_id,
                   deployment_user.id                       AS deployment_user_id,
                   deployment_user.name                     AS deployment_user_name,
                   deployment_user.email                    AS deployment_user_email,
                   deployment_user.photo_url                AS deployment_user_photo_url,
                   deployment_user.created_at               AS deployment_user_created_at,
                   circles.id                               AS circle_id,
                   circles.name                             AS circle_name,
                   circles.reference                        AS circle_reference,
                   circles.created_at                       AS circle_created_at,
                   circles.matcher_type                     AS circle_matcher_type,
                   circles.default_circle                   AS circle_default_circle,
                   circles.rules                            AS circle_rules,
                   circles.imported_kv_records              AS circle_imported_kv_records,
                   circles.imported_at                      AS circle_imported_at,
                   circles.workspace_id                     AS circle_workspace_id,
                   circle_user.id                           AS circle_user_id,
                   circle_user.name                         AS circle_user_name,
                   circle_user.email                        AS circle_user_email,
                   circle_user.photo_url                    AS circle_user_photo_url,
                   circle_user.created_at                   AS circle_user_created_at
            FROM ( $innerQueryStatement ) builds
                     INNER JOIN users build_user ON builds.user_id = build_user.id
                     LEFT JOIN feature_snapshots ON builds.id = feature_snapshots.build_id
                     LEFT JOIN module_snapshots ON feature_snapshots.id = module_snapshots.feature_snapshot_id
                     LEFT JOIN component_snapshots ON module_snapshots.id = component_snapshots.module_snapshot_id
                     LEFT JOIN artifact_snapshots ON component_snapshots.id = artifact_snapshots.component_snapshot_id
                     LEFT JOIN deployments ON builds.id = deployments.build_id
                     LEFT JOIN users deployment_user ON deployments.user_id = deployment_user.id
                     LEFT JOIN circles ON deployments.circle_id = circles.id
                     LEFT JOIN users circle_user ON circles.user_id = circle_user.id
            WHERE 1 = 1
        """
    }
}
