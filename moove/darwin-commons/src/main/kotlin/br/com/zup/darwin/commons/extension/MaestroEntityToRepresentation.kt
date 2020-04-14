/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.extension

import br.com.zup.darwin.commons.constants.MooveConstants
import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.entity.*


fun Deployment.toSimpleRepresentation(): SimpleDeploymentRepresentation = SimpleDeploymentRepresentation(
    id = this.id,
    createdAt = this.createdAt,
    deployedAt = this.deployedAt,
    buildId = this.build.id,
    tag = this.build.tag,
    status = this.status.name,
    circle = this.circle.toRepresentation()
)

fun Deployment.toDefaultRepresentation(currentArtifacts: List<Artifact>): DeploymentRepresentation = DeploymentRepresentation(

        id = this.id,
        author = this.author.toSimpleRepresentation(),
        createdAt = this.createdAt,
        deployedAt = this.deployedAt,
        circle = this.circle.toRepresentation(),
        build = this.build.toSimpleRepresentation(),
        status = this.status.name,
        artifacts =  currentArtifacts.map{
            it-> it.toDeploymentArtifactRepresentation(build)
        }
)

fun Deployment.toRepresentation(): DeploymentRepresentation = DeploymentRepresentation(
    id = this.id,
    author = this.author.toSimpleRepresentation(),
    createdAt = this.createdAt,
    deployedAt = this.deployedAt,
    circle = this.circle.toRepresentation(),
    build = this.build.toSimpleRepresentation(),
    status = this.status.name,
    artifacts = this.build.artifacts.map{it.toDeploymentArtifactRepresentation(this.build)}
)

fun Deployment.toBasicRepresentation(): BasicDeploymentRepresentation = BasicDeploymentRepresentation(
    id = this.id,
    deployedAt = this.deployedAt,
    build = this.build.toFlatRepresentation(),
    status = this.status.name
)

fun List<Deployment>.toSimpleRepresentation(): List<SimpleDeploymentRepresentation> =
    this.map { it.toSimpleRepresentation() }

fun List<Deployment>.toRepresentation(): List<DeploymentRepresentation> =
    this.map { it.toRepresentation() }

fun Circle.toRepresentation(deployment: Deployment? = null): CircleRepresentation = CircleRepresentation(
    id = this.id,
    name = this.name,
    author = this.author?.toSimpleRepresentation(),
    createdAt = this.createdAt,
    matcherType = this.matcherType,
    rules = this.rules,
    deployment = deployment?.toRepresentation(),
    importedAt = this.importedAt,
    importedKvRecords = this.importedKvRecords
)
fun Circle.toDefaultRepresentation(deployment: Deployment? = null,artifacts: List<Artifact>): CircleRepresentation = CircleRepresentation(
        id = this.id,
        name = this.name,
        author = this.author?.toSimpleRepresentation(),
        createdAt = this.createdAt,
        matcherType = this.matcherType,
        rules = this.rules,
        deployment = deployment?.toDefaultRepresentation(artifacts),
        importedAt = this.importedAt,
        importedKvRecords = this.importedKvRecords
)


fun Circle.toManyDeploymentsRepresentation(deployments: List<Deployment?> = emptyList()): CircleManyDeploymentsRepresentation =
    CircleManyDeploymentsRepresentation(
        id = this.id,
        name = this.name,
        author = this.author?.toSimpleRepresentation(),
        createdAt = this.createdAt,
        matcherType = this.matcherType,
        rules = this.rules,
        deployments = deployments.map { it?.toRepresentation() },
        importedAt = this.importedAt,
        importedKvRecords = this.importedKvRecords
    )

fun Circle.toSimpleRepresentation(deployment: Deployment? = null): SimpleCircleRepresentation =
    SimpleCircleRepresentation(
        id = this.id,
        name = this.name,
        createdAt = this.createdAt,
        deployment = deployment?.toBasicRepresentation()
    )

fun Circle.toManyDeploymentsSimpleRepresentation(deployments: List<Deployment?> = emptyList()): ManyDeploymentsCircleRepresentation =
    ManyDeploymentsCircleRepresentation(
        id = this.id,
        name = this.name,
        createdAt = this.createdAt,
        deployments = deployments.map { it?.toBasicRepresentation() }
    )


fun Build.toRepresentation(): BuildRepresentation = BuildRepresentation(
    id = this.id,
    author = this.author.toSimpleRepresentation(),
    createdAt = this.createdAt,
    features = this.features.map { it.toRepresentation() },
    tag = this.tag,
    status = this.status.name,
    deployments = this.deployments.map { it.toSimpleRepresentation() },
    artifacts = this.artifacts.map { it.toRepresentation()}
)

fun Build.toFlatRepresentation(): FlatBuildRepresentation = FlatBuildRepresentation(
    id = this.id,
    tag = this.tag
)

fun Build.toSimpleRepresentation(): SimpleBuildRepresentation = SimpleBuildRepresentation(
    id = this.id,
    createdAt = this.createdAt,
    features = this.features.map { it.toSimpleRepresentation() },
    tag = this.tag,
    status = this.status.name,
    deployments = this.deployments.map { it.toSimpleRepresentation() },
    artifacts = this.artifacts.map { it.toDeploymentArtifactRepresentation(this)}
)

fun Module.toRepresentation(): ModuleRepresentation = ModuleRepresentation(
    id = this.id,
    name = this.name,
    createdAt = this.createdAt,
    author = this.author.toSimpleRepresentation(),
    labels = this.labels.map { it.toRepresentation() },
    gitRepositoryAddress = this.gitRepositoryAddress,
    helmRepository = this.helmRepository,
    gitConfigurationId = this.gitConfiguration.id,
    registryConfigurationId = this.registryConfigurationId,
    cdConfigurationId = this.cdConfigurationId,
    components = this.components.map { it.toRepresentation() }
)

fun Module.toSimpleRepresentation(): SimpleModuleRepresentation = SimpleModuleRepresentation(
    id = this.id,
    name = this.name,
    labels = this.labels.map { it.toRepresentation() }
)

fun Component.toRepresentation(): ComponentRepresentation = ComponentRepresentation(
    id = this.id,
    name = this.name,
    contextPath = this.contextPath,
    healthCheck = this.healthCheck,
    port = this.port,
    createdAt = this.createdAt,
    moduleId = this.module.id,
    artifacts = this.artifacts
        .map { it.toRepresentation() }
)

fun Component.toSimpleRepresentation(): SimpleComponentRepresentation =
    SimpleComponentRepresentation(
        id = this.id,
        name = this.name

    )

fun Artifact.toRepresentation(): ArtifactRepresentation = ArtifactRepresentation(
    id = this.id,
    artifact = this.artifact,
    version = this.version,
    createdAt = this.createdAt,
    buildId = this.build.id,
    componentId = this.component.id
)


fun Artifact.toSimpleRepresentation(): SimpleArtifactRepresentation = SimpleArtifactRepresentation(
    id = this.id,
    version = this.version
)
fun Artifact.toDeploymentArtifactRepresentation(build: Build): DeploymentArtifactRepresentation = DeploymentArtifactRepresentation(
        id = this.id,
        artifact = this.artifact,
        version = this.version,
        createdAt = this.createdAt,
        buildId = this.build.id,
        componentName = this.component.name,
        moduleName =   this.component.module.name
)

fun Feature.toRepresentation(): FeatureRepresentation = FeatureRepresentation(
    id = this.id,
    name = this.name,
    branchName = this.branchName,
    author = this.author.toSimpleRepresentation(),
    modules = this.modules.map { it.toRepresentation() },
    createdAt = this.createdAt,
    branches = this.modules
            .map { it.gitRepositoryAddress }
            .map { "$it/tree/${this.branchName}" }
)

fun Feature.toSimpleRepresentation(): SimpleFeatureRepresentation = SimpleFeatureRepresentation(
    id = this.id,
    name = this.name,
    modules = this.modules.map { it.toSimpleRepresentation() },
    branches = this.modules
            .map { it.gitRepositoryAddress }
            .map { "$it/tree/${this.branchName}" }
)


fun CredentialConfiguration.toRepresentation(): CredentialConfigurationRepresentation =
    CredentialConfigurationRepresentation(
        id = this.id,
        name = this.name,
        author = this.author.toSimpleRepresentation()
    )
