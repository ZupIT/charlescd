/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.repository

import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.charles.infrastructure.repository.mapper.BuildExtractor
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Repository
import java.util.*
import kotlin.collections.LinkedHashMap

@Repository
class JdbcBuildRepository(private val jdbcTemplate: JdbcTemplate, private val buildExtractor: BuildExtractor) :
    BuildRepository {

    companion object {
        const val BASE_QUERY_STATEMENT = """
            select builds.id                                  as build_id,
                   builds.created_at                          as build_created_at,
                   builds.tag                                 as build_tag,
                   builds.card_column_id                      as build_card_column_id,
                   builds.hypothesis_id                       as build_hypothesis_id,
                   builds.status                              as build_status,
                   builds.application_id                      as build_application_id,
                   build_user.id                              as build_user_id,
                   build_user.name                            as build_user_name,
                   build_user.email                           as build_user_email,
                   build_user.photo_url                       as build_user_photo_url,
                   build_user.created_at                      as build_user_created_at,
                   feature_snapshots.id                       as feature_snapshot_id,
                   feature_snapshots.feature_id               as feature_snapshot_feature_id,
                   feature_snapshots.name                     as feature_snapshot_name,
                   feature_snapshots.branch_name              as feature_snapshot_branch_name,
                   feature_snapshots.created_at               as feature_snapshot_created_at,
                   feature_snapshots.author_name              as feature_snapshot_author_name,
                   feature_snapshots.author_id                as feature_snapshot_author_id,
                   feature_snapshots.build_id                 as feature_snapshot_build_id,
                   module_snapshots.id                        as module_snapshot_id,
                   module_snapshots.module_id                 as module_snapshot_module_id,
                   module_snapshots.name                      as module_snapshot_name,
                   module_snapshots.git_repository_address    as module_snapshot_git_repository_address,
                   module_snapshots.created_at                as module_snapshot_created_at,
                   module_snapshots.helm_repository           as module_snapshot_helm_repository,
                   module_snapshots.application_id            as module_snapshot_application_id,
                   module_snapshots.feature_snapshot_id       as module_snapshot_feature_snapshot_id,
                   module_snapshots.git_configuration_id      as module_snapshot_git_configuration_id,
                   module_snapshots.registry_configuration_id as module_snapshot_registry_configuration_id,
                   module_snapshots.cd_configuration_id       as module_snapshot_cd_configuration_id,
                   component_snapshots.id                     as component_snapshot_id,
                   component_snapshots.component_id           as component_snapshot_component_id,
                   component_snapshots.name                   as component_snapshot_name,
                   component_snapshots.context_path           as component_snapshot_context_path,
                   component_snapshots.port                   as component_snapshot_port,
                   component_snapshots.health_check           as component_snapshot_health_check,
                   component_snapshots.created_at             as component_snapshot_created_at,
                   component_snapshots.application_id         as component_snapshot_application_id,
                   component_snapshots.module_snapshot_id     as component_snapshot_module_snapshot_id,
                   artifact_snapshots.id                      as artifact_snapshot_id,
                   artifact_snapshots.artifact                as artifact_snapshot_artifact,
                   artifact_snapshots.version                 as artifact_snapshot_version,
                   artifact_snapshots.component_snapshot_id   as artifact_snapshot_component_snapshot_id,
                   artifact_snapshots.created_at              as artifact_snapshot_created_at,
                   deployments.id                             as deployment_id,
                   deployments.created_at                     as deployment_created_at,
                   deployments.deployed_at                    as deployment_deployed_at,
                   deployments.status                         as deployment_status,
                   deployments.circle_id                      as deployment_circle_id,
                   deployments.build_id                       as deployment_build_id,
                   deployments.application_id                 as deployment_application_id,
                   deployment_user.id                         as deployment_user_id,
                   deployment_user.name                       as deployment_user_name,
                   deployment_user.email                      as deployment_user_email,
                   deployment_user.photo_url                  as deployment_user_photo_url,
                   deployment_user.created_at                 as deployment_user_created_at,
                   circles.id                                 as circle_id,
                   circles.name                               as circle_name,
                   circles.reference                          as circle_reference,
                   circles.created_at                         as circle_created_at,
                   circles.matcher_type                       as circle_matcher_type,
                   circles.rules                              as circle_rules,
                   circles.imported_kv_records                as circle_imported_kv_records,
                   circles.imported_at                        as circle_imported_at,
                   circle_user.id                             as circle_user_id,
                   circle_user.name                           as circle_user_name,
                   circle_user.email                          as circle_user_email,
                   circle_user.photo_url                      as circle_user_photo_url,
                   circle_user.created_at                     as circle_user_created_at
            from builds
                   inner join users build_user on builds.user_id = build_user.id
                   left join feature_snapshots on builds.id = feature_snapshots.build_id
                   left join module_snapshots on feature_snapshots.id = module_snapshots.feature_snapshot_id
                   left join component_snapshots on module_snapshots.id = component_snapshots.module_snapshot_id
                   left join artifact_snapshots on component_snapshots.id = artifact_snapshots.component_snapshot_id
                   left join deployments on builds.id = deployments.build_id
                   left join users deployment_user on deployments.user_id = deployment_user.id
                   left join circles on deployments.circle_id = circles.id
                   left join users circle_user on circles.user_id = circle_user.id
            where 1 = 1
          """
    }

    override fun save(build: Build): Build {
        createBuild(build)

        createLegacyRelationship(build)

        createFeatures(build)

        createModules(build)

        createComponents(build)

        createArtifacts(build)

        return find(build.id, build.applicationId).get()
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

    override fun find(id: String, applicationId: String): Optional<Build> {
        return findByIdAndApplicationId(id, applicationId)
    }

    override fun find(tag: String?, status: BuildStatusEnum?, applicationId: String, page: PageRequest): Page<Build> {
        return this.findByParameters(
            createParametersMap(tag, status, applicationId),
            page
        )
    }

    private fun createLegacyRelationship(build: Build) {
        val statement = "insert into builds_features(" +
                "build_id," +
                "feature_id)" +
                "values(?,?)"

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
            val statement = "insert into artifact_snapshots(" +
                    "id," +
                    "artifact," +
                    "version," +
                    "created_at," +
                    "component_snapshot_id)" +
                    "values(?,?,?,?,?)"

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
            val statement = "insert into feature_snapshots(" +
                    "id," +
                    "feature_id," +
                    "name," +
                    "branch_name," +
                    "created_at," +
                    "author_name," +
                    "author_id," +
                    "build_id) values(" +
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
            val statement = "insert into module_snapshots(" +
                    "id," +
                    "module_id," +
                    "name," +
                    "git_repository_address," +
                    "created_at," +
                    "helm_repository," +
                    "application_id," +
                    "feature_snapshot_id," +
                    "git_configuration_id," +
                    "registry_configuration_id," +
                    "cd_configuration_id) values(" +
                    "?,?,?,?,?,?,?,?,?,?,?)"

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
                        it.applicationId,
                        it.featureSnapshotId,
                        it.gitConfigurationId,
                        it.registryConfigurationId,
                        it.cdConfigurationId
                    )
                }
            )
        }
    }

    private fun createComponents(build: Build) {
        val components = build.components()

        if (components.isNotEmpty()) {
            val statement = "insert into component_snapshots(" +
                    "id," +
                    "component_id," +
                    "name," +
                    "context_path," +
                    "port," +
                    "health_check," +
                    "created_at," +
                    "application_id," +
                    "module_snapshot_id) values(" +
                    "?,?,?,?,?,?,?,?,?)"

            this.jdbcTemplate.batchUpdate(
                statement,
                components.map {
                    arrayOf(
                        it.id,
                        it.componentId,
                        it.name,
                        it.contextPath,
                        it.port,
                        it.healthCheck,
                        it.createdAt,
                        it.applicationId,
                        it.moduleSnapshotId
                    )
                }
            )
        }
    }

    private fun createArtifacts(build: Build) {
        createArtifactSnapshots(build.artifacts())
    }

    private fun createBuild(build: Build) {
        val statement = "insert into builds(" +
                "id," +
                "user_id," +
                "created_at," +
                "tag," +
                "card_column_id," +
                "hypothesis_id," +
                "status," +
                "application_id)values(" +
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
            build.applicationId
        )
    }

    private fun findByIdAndApplicationId(id: String, applicationId: String): Optional<Build> {
        val statement = StringBuilder(BASE_QUERY_STATEMENT)
            .appendln("and builds.id = ?")
            .appendln(" and builds.application_id = ?")

        return Optional.ofNullable(
            this.jdbcTemplate.query(statement.toString(), arrayOf(id, applicationId), buildExtractor)?.firstOrNull()
        )
    }

    private fun createParametersMap(
        tag: String?,
        status: BuildStatusEnum?,
        applicationId: String
    ): Map<String, String> {
        val parameters = LinkedHashMap<String, String>()

        tag?.apply {
            parameters["tag"] = "%$this%"
        }

        status?.apply {
            parameters["status"] = status.name
        }

        parameters["application_id"] = applicationId

        return parameters
    }

    private fun findByParameters(parameters: Map<String, String>, page: PageRequest): Page<Build> {
        val count = executeCount(createCountQuery(parameters), parameters)

        val result = this.jdbcTemplate.query(
            createQueryStatement(parameters, page),
            parameters.values.toTypedArray(),
            buildExtractor
        )

        return Page(result?.toList() ?: emptyList(), page.page, page.size, count ?: 0)
    }

    private fun createQueryStatement(
        parameters: Map<String, String>,
        page: PageRequest
    ): String {
        val statement = StringBuilder(
            BASE_QUERY_STATEMENT
        )

        parameters.forEach { (k, _) -> appendParameter(k, statement) }

        return statement
            .appendln("limit ${page.size}")
            .appendln("offset ${page.offset()}")
            .toString()
    }

    private fun executeCount(
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
                select count(*)
                from builds where 1 = 1
                """
        )

        parameters.forEach { (k, _) -> appendParameter(k, statement) }

        return statement.toString()
    }

    private fun appendParameter(parameter: String, query: StringBuilder) {
        when (parameter) {
            "tag" -> query.appendln("and builds.$parameter ilike ?")
            else -> query.appendln("and builds.$parameter = ?")
        }
    }

    private fun deleteBuild(build: Build) {
        val statement = "delete from builds where id = ?"
        this.jdbcTemplate.update(statement, build.id)
    }

    private fun deleteArtifacts(build: Build) {
        val statement = "delete from artifact_snapshots where id = ?"
        val artifacts = build.artifacts()
        this.jdbcTemplate.batchUpdate(
            statement,
            artifactIdArray(artifacts)
        )
    }

    private fun deleteComponents(build: Build) {
        val statement = "delete from component_snapshots where id = ?"
        val components = build.components()
        this.jdbcTemplate.batchUpdate(
            statement,
            componentIdArray(components)
        )
    }

    private fun deleteModules(build: Build) {
        val statement = "delete from module_snapshots where id = ?"
        val modules = build.modules()
        this.jdbcTemplate.batchUpdate(
            statement,
            moduleIdArray(modules)
        )
    }

    private fun deleteFeatures(build: Build) {
        val statement = "delete from feature_snapshots where id = ?"
        this.jdbcTemplate.batchUpdate(
            statement,
            featureIdArray(build)
        )
    }

    private fun deleteDeployments(build: Build) {
        val statement = "delete from deployments where id = ?"
        this.jdbcTemplate.batchUpdate(
            statement,
            deploymentIdArray(build)
        )
    }

    private fun updateBuildStatus(status: BuildStatusEnum, id: String) {
        val statement = "update builds set status = ? where id = ?"
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
}