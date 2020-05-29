/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.commons

import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.commons.extension.toManyDeploymentsRepresentation
import io.charlescd.moove.commons.extension.toManyDeploymentsSimpleRepresentation
import io.charlescd.moove.commons.extension.toRepresentation
import io.charlescd.moove.commons.extension.toSimpleRepresentation
import io.charlescd.moove.legacy.repository.entity.*
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
        every { component.createdAt } returns LocalDateTime.now()
        val module = createModule(user)
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
        every { mockComponent.createdAt } returns LocalDateTime.now()
        every { mockComponent.module } returns mockModule
        val module = createModule(user)
        val argumentRepresentation = module.toRepresentation()


        assertNotNull(argumentRepresentation)
        assertEquals(argumentRepresentation.id, module.id)
        assertEquals(argumentRepresentation.name, module.name)
        assertEquals(argumentRepresentation.createdAt.toString(), module.createdAt.toString())
        assertEquals(argumentRepresentation.author.id, module.author.id)
        assertEquals(argumentRepresentation.labels.size, module.labels.size)
        assertEquals(argumentRepresentation.gitRepositoryAddress, module.gitRepositoryAddress)
        assertEquals(argumentRepresentation.helmRepository, module.helmRepository)
    }

    @Test
    fun `should convert component to simple representation`() {
        val build = mockkClass(Build::class)
        every { build.id } returns "build-id"
        val user = createUser()
        val component = createComponent(createModule(user))
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
        val component = createComponent(createModule(user))
        println(component.id)
        val representation = component.toRepresentation()

        assertNotNull(representation)
        assertEquals(representation.id, component.id)
        assertEquals(representation.name, component.name)
        assertEquals(representation.createdAt.toString(), component.createdAt.toString())
        assertEquals(representation.moduleId, component.module.id)
    }

    @Test
    fun `should convert feature to simple representation`() {
        val user = createUser()


        val component = mockkClass(Component::class)
        every { component.id } returns "component-id"
        every { component.name } returns "component-name"
        every { component.createdAt } returns LocalDateTime.now()


        val feature = createFeature(user)
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
        workspaceId = "application-id"
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
        author: User
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
            Workspace(
                "applicationId",
                "application",
                LocalDateTime.now(),
                mutableListOf(),
                author,
                "894cbe3a-ff7a-437a-b648-96b2c5c5557b",
                "142ba1ba-3d82-4a02-a31a-e993e08bde93",
                "4fc77750-cca9-4e70-bf35-cbf48e460faa",
                "f6071cf0-9aaf-4900-9c61-28c7805514f9"
            )
        )
    }

    private fun createComponent(
        module: Module
    ) = Component(
        "component-id",
        "component-name",
        LocalDateTime.now(),
        module,
        "applicationId",
        10,
        10
    )

    private fun createFeature(user: User) = Feature(
        "component-id",
        "artifact-name",
        "branch-name",
        user,
        LocalDateTime.now(),
        listOf(createModule(user)),
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
        false,
        LocalDateTime.now()
    )
}
