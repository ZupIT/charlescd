/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import br.com.zup.darwin.commons.extension.*
import br.com.zup.darwin.entity.*
import com.fasterxml.jackson.databind.JsonNode
import io.mockk.every
import io.mockk.mockkClass
import org.junit.Test
import java.time.LocalDateTime
import java.util.*
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class MaestroToRepresentationTest {

    @Test
    fun `should convert circle to representation with many deployments`() {
        val node = mockkClass(JsonNode::class)

        val user = createUser()
        val circle = createCircle(node, user)
        val cardColumn = mockkClass(CardColumn::class)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)
        val secondDeployment = createDeployment(user, circle, build)
        val representation = circle.toManyDeploymentsRepresentation(deployments = listOf(deployment, secondDeployment))


        assertNotNull(representation)
        assertEquals(representation.deployments[0]?.id, deployment.id)
        assertEquals(representation.deployments[1]?.id, secondDeployment.id)
    }

    @Test
    fun `should convert circle to simple representation`() {
        val node = mockkClass(JsonNode::class)

        val user = createUser()
        val circle = createCircle(node, user)
        val cardColumn = mockkClass(CardColumn::class)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)
        val representation = circle.toSimpleRepresentation(deployment)

        assertNotNull(representation)
        assertNotNull(representation.id)
        assertNotNull(representation.name)
        assertNotNull(representation.createdAt)
        assertEquals(representation.deployment?.id, deployment.id)
    }

    @Test
    fun `should convert circle to simple representation with many deployments`() {
        val node = mockkClass(JsonNode::class)

        val user = createUser()
        val circle = createCircle(node, user)
        val cardColumn = mockkClass(CardColumn::class)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)
        val secondDeployment = createDeployment(user, circle, build)
        val representation = circle.toManyDeploymentsSimpleRepresentation(listOf(deployment, secondDeployment))

        assertNotNull(representation)
        assertNotNull(representation.id)
        assertNotNull(representation.name)
        assertNotNull(representation.createdAt)
        assertEquals(representation.deployments[0]?.id, deployment.id)
        assertEquals(representation.deployments[1]?.id, secondDeployment.id)
    }

    @Test
    fun `should convert deployment to representation`() {
        val node = mockkClass(JsonNode::class)
        val cardColumn = mockkClass(CardColumn::class)
        val user = createUser()
        val circle = createCircle(node, user)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)

        val representation = deployment.toRepresentation()

        assertNotNull(representation)
        assertEquals(representation.id, deployment.id)
    }

    @Test
    fun `should convert deployment to simple representation`() {
        val node = mockkClass(JsonNode::class)
        val cardColumn = mockkClass(CardColumn::class)
        val user = createUser()
        val circle = createCircle(node, user)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)

        val simpleRepresentation = deployment.toSimpleRepresentation()

        assertNotNull(simpleRepresentation)
        assertEquals(simpleRepresentation.id, deployment.id)
    }

    @Test
    fun `should convert module to simple representation`() {
        val user = createUser()
        val component = mockkClass(Component::class)
        every { component.id } returns "component-id"
        every { component.name } returns "component-name"
        every { component.contextPath } returns "component-context"
        every { component.port } returns 8080
        every { component.artifacts } returns emptyList()
        every { component.createdAt } returns LocalDateTime.now()
        val gitCredentials = GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
        val gitConfiguration = GitConfiguration(
            "credential-id",
            "credential-name",
            LocalDateTime.now(),
            user,
            "application-id",
            gitCredentials
        )
        val module = createModule(user, component, gitConfiguration)
        val argumentRepresentation = module.toSimpleRepresentation()


        assertNotNull(argumentRepresentation)
        assertEquals(argumentRepresentation.id, module.id)
        assertEquals(argumentRepresentation.name, module.name)
        assertEquals(argumentRepresentation.labels.size, module.labels.size)
    }

    @Test
    fun `should convert module to  representation`() {
        val user = createUser()
        val mockComponent = mockkClass(Component::class)
        val mockModule = mockkClass(Module::class)
        every { mockModule.id } returns "module-id"
        every { mockComponent.id } returns "component-id"
        every { mockComponent.name } returns "component-name"
        every { mockComponent.contextPath } returns "component-context"
        every { mockComponent.healthCheck } returns "component-health-check"
        every { mockComponent.port } returns 8080
        every { mockComponent.artifacts } returns emptyList()
        every { mockComponent.createdAt } returns LocalDateTime.now()
        every { mockComponent.module } returns mockModule
        val gitCredentials = GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
        val gitConfiguration = GitConfiguration(
            "credential-id",
            "credential-name",
            LocalDateTime.now(),
            user,
            "application-id",
            gitCredentials
        )

        val module = createModule(user, mockComponent, gitConfiguration)
        val argumentRepresentation = module.toRepresentation()


        assertNotNull(argumentRepresentation)
        assertEquals(argumentRepresentation.id, module.id)
        assertEquals(argumentRepresentation.name, module.name)
        assertEquals(argumentRepresentation.createdAt.toString(), module.createdAt.toString())
        assertEquals(argumentRepresentation.author.id, module.author.id)
        assertEquals(argumentRepresentation.labels.size, module.labels.size)
        assertEquals(argumentRepresentation.gitRepositoryAddress, module.gitRepositoryAddress)
        assertEquals(argumentRepresentation.helmRepository, module.helmRepository)
        assertEquals(argumentRepresentation.gitConfigurationId, module.gitConfiguration.id)
        assertEquals(argumentRepresentation.cdConfigurationId, module.cdConfigurationId)

    }

    @Test
    fun `should convert component to simple representation`() {
        val build = mockkClass(Build::class)
        every { build.id } returns "build-id"
        val user = createUser()
        val artifact = Artifact(
            "artifact-id",
            "artifact-name",
            "artifact-version",
            LocalDateTime.now(),
            build,
            mockkClass(Component::class)
        )
        val gitCredentials = GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
        val gitConfiguration = GitConfiguration(
            "credential-id",
            "credential-name",
            LocalDateTime.now(),
            user,
            "application-id",
            gitCredentials
        )
        val component = createComponent(createModule(user, mockkClass(Component::class), gitConfiguration), artifact)
        val simpleRepresentation = component.toSimpleRepresentation()

        assertNotNull(simpleRepresentation)
        assertEquals(simpleRepresentation.id, component.id)
        assertEquals(simpleRepresentation.name, component.name)

    }

    @Test
    fun `should convert component to  representation`() {
        val build = mockkClass(Build::class)
        val mockComponent = mockkClass(Component::class)
        every { mockComponent.id } returns "component-id"
        every { build.id } returns "build-id"
        val user = createUser()
        val artifact =
            Artifact("artifact-id", "artifact-name", "artifact-version", LocalDateTime.now(), build, mockComponent)
        val gitCredentials = GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
        val gitConfiguration = GitConfiguration(
            "credential-id",
            "credential-name",
            LocalDateTime.now(),
            user,
            "application-id",
            gitCredentials
        )
        val component = createComponent(createModule(user, mockComponent, gitConfiguration), artifact)
        println(component.id)
        val representation = component.toRepresentation()

        assertNotNull(representation)
        assertEquals(representation.id, component.id)
        assertEquals(representation.name, component.name)
        assertEquals(representation.contextPath, component.contextPath)
        assertEquals(representation.healthCheck, component.healthCheck)
        assertEquals(representation.port, component.port)
        assertEquals(representation.createdAt.toString(), component.createdAt.toString())
        assertEquals(representation.moduleId, component.module.id)
        assertEquals(representation.artifacts[0].version, component.artifacts[0].version)
    }

    @Test
    fun `should convert artifact to simple representation`() {
        val cardColumn = mockkClass(CardColumn::class)
        val user = createUser()
        val build = createBuild(user, cardColumn)
        val gitCredentials = GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)
        val gitConfiguration = GitConfiguration(
            "credential-id",
            "credential-name",
            LocalDateTime.now(),
            user,
            "application-id",
            gitCredentials
        )
        val module = createModule(user, mockkClass(Component::class), gitConfiguration)
        val component = createComponent(module, mockkClass(Artifact::class))
        val artifact = createArtifact(component, build)
        val simpleRepresentation = artifact.toSimpleRepresentation()

        assertNotNull(simpleRepresentation)
        assertEquals(simpleRepresentation.id, artifact.id)
        assertEquals(simpleRepresentation.version, artifact.version)
    }

    @Test
    fun `should convert artifact to circle  representation`() {
        val module = mockkClass(Module::class)
        every { module.id } returns "module-id  "
        every { module.name } returns "module-name"
        val cardColumn = mockkClass(CardColumn::class)
        val user = createUser()
        val component = mockkClass(Component::class)
        every { component.id } returns "component-id"
        every { component.name } returns "component-name"
        every { component.contextPath } returns "component-context"
        every { component.port } returns 8080
        every { component.artifacts } returns emptyList()
        every { component.createdAt } returns LocalDateTime.now()
        every { component.module } returns module
        val feature = createFeature(user, component)
        val build = Build(
            id = "build-id",
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature),
            tag = "build-tag",
            column = cardColumn,
            status = BuildStatus.BUILT,
            applicationId = "application-id"
        )

        val artifact = createArtifact(component, build)
        val circleRepresentation = artifact.toDeploymentArtifactRepresentation(build)

        assertNotNull(circleRepresentation)
        assertEquals(circleRepresentation.id, artifact.id)
        assertEquals(circleRepresentation.version, artifact.version)
        assertEquals(circleRepresentation.createdAt.toString(), artifact.createdAt.toString())
        assertEquals(circleRepresentation.buildId, artifact.build.id)
        assertEquals(circleRepresentation.componentName, artifact.component.name)
        assertEquals(circleRepresentation.moduleName, module.name)
    }

    @Test
    fun `should convert feature to simple representation`() {
        val user = createUser()


        val component = mockkClass(Component::class)
        every { component.id } returns "component-id"
        every { component.name } returns "component-name"
        every { component.contextPath } returns "component-context"
        every { component.port } returns 8080
        every { component.artifacts } returns emptyList()
        every { component.createdAt } returns LocalDateTime.now()


        val feature = createFeature(user, component)
        val simpleRepresentation = feature.toSimpleRepresentation()
        assertNotNull(simpleRepresentation)
        assertEquals(simpleRepresentation.id, feature.id)
        assertEquals(simpleRepresentation.name, feature.name)
        assertEquals(simpleRepresentation.modules.size, feature.modules.size)
        assertEquals(simpleRepresentation.branches, feature.modules
            .map { it.gitRepositoryAddress }
            .map { "$it/tree/${feature.branchName}" })
    }

    @Test
    fun `should convert circle to representation`() {
        val node = mockkClass(JsonNode::class)
        val cardColumn = mockkClass(CardColumn::class)
        val user = createUser()
        val circle = createCircle(node, user)
        val build = createBuild(user, cardColumn)
        val deployment = createDeployment(user, circle, build)

        val representation = circle.toRepresentation(deployment)

        assertNotNull(representation)
        assertEquals(representation.id, circle.id)

        val newRepresentation = circle.toRepresentation()
        assertNotNull(newRepresentation)
        assertEquals(newRepresentation.id, circle.id)
        assertNull(newRepresentation.deployment)
    }

    private fun createBuild(
        user: User,
        cardColumn: CardColumn
    ) = Build(
        id = "build-id",
        author = user,
        createdAt = LocalDateTime.now(),
        features = emptyList(),
        tag = "build-tag",
        column = cardColumn,
        status = BuildStatus.BUILT,
        applicationId = "application-id"
    )

    private fun createDeployment(
        user: User,
        circle: Circle,
        build: Build
    ) = Deployment(
        "deployment-id",
        user,
        LocalDateTime.now(),
        LocalDateTime.now(),
        DeploymentStatus.DEPLOYED,
        circle,
        build,
        "application-id"
    )

    private fun createModule(
        author: User,
        component: Component,
        gitConfiguration: GitConfiguration
    ): Module {
        val label = Label("label-id", "label-name", LocalDateTime.now(), author, "hex-color")
        return Module(
            "moduleId",
            "module",
            "gitRepositoryAddress",
            LocalDateTime.of(2019, 12, 1, 0, 0),
            "helm-repository",
            author,
            listOf(label),
            emptyList(),
            "app-id",
            gitConfiguration,
            "k8s-configuration-id",
            "registry-id"
        )
    }

    private fun createComponent(
        module: Module,
        artifact: Artifact
    ) = Component(
        "component-id",
        "component-name",
        "component-context",
        8081,
        "darwin-demo/health",
        LocalDateTime.now(),
        module,
        listOf(artifact),
        "applicationId"
    )


    private fun createArtifact(
        component: Component, build: Build
    ) = Artifact(
        "component-id",
        "artifact-name",
        "version-name",
        LocalDateTime.now(),
        build,
        component
    )

    private fun createFeature(
        user: User, component: Component
    ) = Feature(
        "component-id",
        "artifact-name",
        "branch-name",
        user,
        LocalDateTime.now(),
        listOf(createModule(user, component, mockkClass(GitConfiguration::class))),
        "application-id"
    )

    private fun createCircle(
        node: JsonNode,
        user: User
    ) = Circle(
        id = "circle-id",
        name = "circle-name",
        author = user,
        createdAt = LocalDateTime.now(),
        matcherType = MatcherType.SIMPLE_KV,
        rules = node,
        reference = UUID.randomUUID().toString()
    )

    private fun createUser() = User(
        "user-id",
        "user-name",
        "user@zup.com.br",
        "https://user.com.br/image.jpg",
        listOf(),
        LocalDateTime.now()
    )
}
