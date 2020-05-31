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

package io.charlescd.moove.commons.extension

import io.charlescd.moove.commons.representation.*
import io.charlescd.moove.legacy.repository.entity.*

fun Deployment.toSimpleRepresentation(): SimpleDeploymentRepresentation = SimpleDeploymentRepresentation(
    id = this.id,
    createdAt = this.createdAt,
    deployedAt = this.deployedAt,
    buildId = this.build.id,
    tag = this.build.tag,
    status = this.status.name,
    circle = this.circle.toRepresentation()
)

fun Deployment.toDefaultRepresentation(): DeploymentRepresentation =
    DeploymentRepresentation(

        id = this.id,
        author = this.author.toSimpleRepresentation(),
        createdAt = this.createdAt,
        deployedAt = this.deployedAt,
        circle = this.circle.toRepresentation(),
        build = this.build.toSimpleRepresentation(),
        status = this.status.name
    )

fun Deployment.toRepresentation(): DeploymentRepresentation = DeploymentRepresentation(
    id = this.id,
    author = this.author.toSimpleRepresentation(),
    createdAt = this.createdAt,
    deployedAt = this.deployedAt,
    circle = this.circle.toRepresentation(),
    build = this.build.toSimpleRepresentation(),
    status = this.status.name
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

fun Circle.toDefaultRepresentation(deployment: Deployment? = null): CircleRepresentation =
    CircleRepresentation(
        id = this.id,
        name = this.name,
        author = this.author?.toSimpleRepresentation(),
        createdAt = this.createdAt,
        matcherType = this.matcherType,
        rules = this.rules,
        deployment = deployment?.toDefaultRepresentation(),
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
    deployments = this.deployments.map { it.toSimpleRepresentation() }
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
    deployments = this.deployments.map { it.toSimpleRepresentation() }
)

fun Module.toRepresentation(): ModuleRepresentation = ModuleRepresentation(
    id = this.id,
    name = this.name,
    createdAt = this.createdAt,
    author = this.author.toSimpleRepresentation(),
    labels = this.labels.map { it.toRepresentation() },
    gitRepositoryAddress = this.gitRepositoryAddress,
    helmRepository = this.helmRepository,
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
    createdAt = this.createdAt,
    moduleId = this.module.id,
    latencyThreshold = this.latencyThreshold,
    errorThreshold = this.errorThreshold
)

fun Component.toSimpleRepresentation(): SimpleComponentRepresentation =
    SimpleComponentRepresentation(
        id = this.id,
        name = this.name

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
