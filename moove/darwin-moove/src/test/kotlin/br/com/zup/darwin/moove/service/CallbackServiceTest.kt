/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.request.callback.DeployCallbackRequest
import br.com.zup.darwin.moove.request.callback.DeployRequestStatus
import br.com.zup.darwin.moove.request.callback.VillagerCallbackRequest
import br.com.zup.darwin.repository.ArtifactRepository
import br.com.zup.darwin.repository.BuildRepository
import br.com.zup.darwin.repository.ComponentRepository
import br.com.zup.darwin.repository.DeploymentRepository
import br.com.zup.exception.handler.exception.NotFoundException
import io.mockk.every
import io.mockk.mockkClass
import io.mockk.verify
import org.junit.Before
import org.junit.Test
import java.time.LocalDateTime
import java.util.*

class CallbackServiceTest {

    private val authorId = "authorId"
    private val user = User(authorId, "username", "email", "url", listOf(), LocalDateTime.now())
    private val gitConfiguration1 = getGitConfiguration()
    private val feature1 = createFeature("id1", "feature1", "feature-1")
    private val label = Label("labeId", "LABEL", LocalDateTime.now(), user, "BAADD")
    private val component1Name = "component1"
    private val component1Id = "componentId1"
    private val helmRepository = "http://github.com"
    private val component1 = mockkClass(Component::class)
    private val module1 = Module(
        "name",
        "repo1/owner1",
        "https://github.com/repo1/owner1",
        LocalDateTime.now(),
        helmRepository,
        user,
        listOf(label),
        listOf(component1),
        "application-id",
        gitConfiguration1,
        "k8s-id1",
        "registry-id1"
    )
    private val villagerCallbackRequest = VillagerCallbackRequest(
        status = VillagerCallbackRequest.VillagerBuildStatus.SUCCESS,
        modules = listOf(
            VillagerCallbackRequest.VillagerImageRequest(
                moduleId = "name", status = VillagerCallbackRequest.VillagerBuildStatus.SUCCESS,
                components = listOf(
                    VillagerCallbackRequest.VillagerComponentRequest(
                        name = "name",
                        tagName = "tagName"
                    )
                )
            )
        )
    )
    private val component = Component(
        id = "id",
        name = "name",
        contextPath = "contextPath",
        port = 1234,
        healthCheck = "/health-check",
        createdAt = LocalDateTime.now(),
        module = module1,
        applicationId = "application-id"
    )

    private val buildRepository: BuildRepository = mockkClass(BuildRepository::class)
    private val artifactRepository: ArtifactRepository = mockkClass(ArtifactRepository::class)
    private val componentRepository: ComponentRepository = mockkClass(ComponentRepository::class)
    private val deploymentRepository: DeploymentRepository = mockkClass(DeploymentRepository::class)
    private val callbackService: CallbackService =
        CallbackService(buildRepository, artifactRepository, componentRepository, deploymentRepository)

    @Before
    fun setUp() {
        every { component1.name } returns component1Name
        every { component1.id } returns component1Id
        every { component1.createdAt } returns LocalDateTime.now()
        every { component1.module } returns module1
        every { component1.artifacts } returns emptyList()
        every { component1.contextPath } returns "/context1"
        every { component1.healthCheck } returns "/health"
        every { component1.port } returns 8080
    }

    @Test(expected = NotFoundException::class)
    fun `when calling villagerCallback method, if there is no build should throw exception `() {
        val build = getBuild(BuildStatus.BUILT)
        every { buildRepository.findById(build.id) } returns Optional.empty()

        callbackService.villagerCallback(build.id, villagerCallbackRequest)

        verify(exactly = 1) { buildRepository.findById(build.id) }
    }

    @Test
    fun `when calling villagerCallback method, if there is no need to update the build should not do it `() {
        val build = getBuild(BuildStatus.BUILT)
        every { buildRepository.findById(build.id) } returns Optional.of(build)

        callbackService.villagerCallback(build.id, villagerCallbackRequest)

        verify(exactly = 1) { buildRepository.findById(build.id) }
        verify(exactly = 0) { buildRepository.saveAndFlush(any() as Build) }
    }

    @Test
    fun `when calling villagerCallback method, if it needs to update should do it `() {
        val build = getBuild(BuildStatus.BUILDING)

        every { buildRepository.findById(build.id) } returns Optional.of(build)
        every { buildRepository.saveAndFlush(any() as Build) } returns build
        every { componentRepository.findByModuleId(module1.id) } returns listOf(component)
        every { artifactRepository.saveAndFlush(any() as Artifact) } returns Artifact(
            id = "id",
            artifact = "artifact",
            version = "version",
            createdAt = LocalDateTime.now(),
            build = build,
            component = component
        )

        callbackService.villagerCallback(build.id, villagerCallbackRequest)

        verify(exactly = 1) { buildRepository.findById(build.id) }
        verify(exactly = 1) { buildRepository.saveAndFlush(any() as Build) }
        verify(exactly = 1) { artifactRepository.saveAndFlush(any() as Artifact) }
    }

    @Test(expected = NotFoundException::class)
    fun `when calling deploymentCallback, if deployment is not found should throw exception`() {
        val deploymentId = "deploymentId"
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.SUCCEEDED)

        every { deploymentRepository.findById(deploymentId) } returns Optional.empty()

        callbackService.deploymentCallback(deploymentId, deploymentCallbackRequest)
    }

    @Test
    fun `when calling deploymentCallback with DeployRequestStatus equals SUCCEEDED`() {
        val build = getBuild(BuildStatus.BUILDING)

        val deployment = Deployment(
            id = "deploymentId",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = DeploymentStatus.DEPLOYING,
            circle = Circle(
                id = "circleId",
                name = "circleName",
                reference = "reference",
                author = user,
                createdAt = LocalDateTime.now(),
                matcherType = MatcherType.REGULAR
            ),
            build = build,
            applicationId = "application-id"
        )
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.SUCCEEDED)

        every { deploymentRepository.findById(deployment.id) } returns Optional.of(deployment)
        every { deploymentRepository.save(any() as Deployment) } returns deployment
        every {
            deploymentRepository.findByCircleIdAndStatus(
                deployment.circle.id,
                DeploymentStatus.DEPLOYED
            )
        } returns listOf(deployment)

        callbackService.deploymentCallback(deployment.id, deploymentCallbackRequest)

        verify(exactly = 2) { deploymentRepository.save(any() as Deployment) }
    }

    @Test
    fun `should not update old deployment status when circle is Default`() {
        val build = getBuild(BuildStatus.BUILDING)

        val deployment = Deployment(
            id = "deploymentId",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = DeploymentStatus.DEPLOYING,
            circle = Circle(
                id = "circleId",
                name = "Default",
                reference = "reference",
                author = user,
                createdAt = LocalDateTime.now(),
                matcherType = MatcherType.REGULAR
            ),
            build = build,
            applicationId = "application-id"
        )
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.SUCCEEDED)

        every { deploymentRepository.findById(deployment.id) } returns Optional.of(deployment)
        every { deploymentRepository.save(any() as Deployment) } returns deployment

        callbackService.deploymentCallback(deployment.id, deploymentCallbackRequest)

        verify(exactly = 0) { deploymentRepository.findByCircleIdAndStatus(deployment.circle.id, DeploymentStatus.DEPLOYED) }
        verify(exactly = 1) { deploymentRepository.save(any() as Deployment) }
    }

    @Test
    fun `when calling deploymentCallback with DeployRequestStatus equals FAILED`() {
        val build = getBuild(BuildStatus.BUILDING)

        val deployment = Deployment(
            id = "deploymentId",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = DeploymentStatus.DEPLOY_FAILED,
            circle = Circle(
                id = "circleId",
                name = "circleName",
                reference = "reference",
                author = user,
                createdAt = LocalDateTime.now(),
                matcherType = MatcherType.REGULAR
            ),
            build = build,
            applicationId = "application-id"
        )
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.FAILED)

        every { deploymentRepository.findById(deployment.id) } returns Optional.of(deployment)
        every { deploymentRepository.save(any() as Deployment) } returns deployment

        callbackService.deploymentCallback(deployment.id, deploymentCallbackRequest)

        verify(exactly = 1) { deploymentRepository.save(deployment) }
    }

    @Test
    fun `when calling deploymentCallback with DeployRequestStatus equals UNDEPLOYED`() {
        val build = getBuild(BuildStatus.BUILDING)

        val deployment = Deployment(
            id = "deploymentId",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = DeploymentStatus.NOT_DEPLOYED,
            circle = Circle(
                id = "circleId",
                name = "circleName",
                reference = "reference",
                author = user,
                createdAt = LocalDateTime.now(),
                matcherType = MatcherType.REGULAR
            ),
            build = build,
            applicationId = "application-id"
        )
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.UNDEPLOYED)

        every { deploymentRepository.findById(deployment.id) } returns Optional.of(deployment)
        every { deploymentRepository.save(any() as Deployment) } returns deployment

        callbackService.deploymentCallback(deployment.id, deploymentCallbackRequest)

        verify(exactly = 1) { deploymentRepository.save(deployment) }
    }

    @Test
    fun `when calling deploymentCallback with DeployRequestStatus equals UNDEPLOY_FAILED`() {
        val build = getBuild(BuildStatus.BUILDING)

        val deployment = Deployment(
            id = "deploymentId",
            author = user,
            createdAt = LocalDateTime.now(),
            deployedAt = LocalDateTime.now(),
            status = DeploymentStatus.DEPLOYED,
            circle = Circle(
                id = "circleId",
                name = "circleName",
                reference = "reference",
                author = user,
                createdAt = LocalDateTime.now(),
                matcherType = MatcherType.REGULAR
            ),
            build = build,
            applicationId = "application-id"
        )
        val deploymentCallbackRequest = DeployCallbackRequest(deploymentStatus = DeployRequestStatus.UNDEPLOY_FAILED)

        every { deploymentRepository.findById(deployment.id) } returns Optional.of(deployment)
        every { deploymentRepository.save(any() as Deployment) } returns deployment

        callbackService.deploymentCallback(deployment.id, deploymentCallbackRequest)

        verify(exactly = 1) { deploymentRepository.save(deployment) }
    }

    private fun getBuild(status: BuildStatus): Build {
        return Build(
            id = "75ce3e2d-d0fd-4ba1-8eda-a2d0c08df2b3",
            author = user,
            createdAt = LocalDateTime.now(),
            features = listOf(feature1),
            tag = "TAG",
            status = status,
            applicationId = "application-id"
        )
    }

    private fun createFeature(id: String, name: String, featureBranch: String): Feature =
        Feature(id, name, featureBranch, user, LocalDateTime.now(), listOf(module1), "application-id")

    private fun buildCredentialConfig(type: CredentialConfigurationType): CredentialConfiguration =
        CredentialConfiguration(UUID.randomUUID().toString(), "name", type, LocalDateTime.now(), user, "application-id")

    private fun getGitConfiguration(): GitConfiguration = GitConfiguration(
        "ID", "Git Credential Name", LocalDateTime.now(), user, "applicationId",
        GitCredentials(
            "address", "username", "password", null,
            GitServiceProvider.GITHUB
        )
    )

}
