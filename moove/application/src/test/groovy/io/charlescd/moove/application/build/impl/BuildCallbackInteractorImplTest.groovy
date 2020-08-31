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

package io.charlescd.moove.application.build.impl

import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.build.BuildCallbackInteractor
import io.charlescd.moove.application.build.request.BuildCallbackRequest
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import org.hibernate.exception.ConstraintViolationException
import org.springframework.dao.DuplicateKeyException
import spock.lang.Specification

import java.time.LocalDateTime

class BuildCallbackInteractorImplTest extends Specification {

    private BuildCallbackInteractor buildCallbackInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.buildCallbackInteractor = new BuildCallbackInteractorImpl(new BuildService(buildRepository))
    }

    def "when build does not exists should throw an exception"() {
        given:
        def buildId = "5ac7c34a-33dc-4bde-8161-e84d829561bb"
        def buildCallbackModulePart = new BuildCallbackRequest.ModulePart("fd845a23-5eb9-48dc-ab65-02e2650ed4bd", BuildCallbackRequest.Status.SUCCESS, [])
        def buildCallbackRequest = new BuildCallbackRequest(BuildCallbackRequest.Status.SUCCESS, [buildCallbackModulePart])

        when:
        this.buildCallbackInteractor.execute(buildId, buildCallbackRequest)

        then:
        1 * this.buildRepository.findById(_) >> { argument ->
            def id = argument[0]

            assert id == buildId
            assert id instanceof String

            return Optional.empty()
        }

        0 * this.buildRepository.updateStatus(_, _)

        0 * this.buildRepository.saveArtifacts(_)

        def exception = thrown(NotFoundException)

        assert exception.resourceName == "build"
        assert exception.id == buildId
    }

    def "should updated build status and create component snapshots"() {
        given:
        def buildId = "5ac7c34a-33dc-4bde-8161-e84d829561bb"
        def buildCallbackComponentPart = new BuildCallbackRequest.ComponentPart("Component snapshot name", "v-1.0.0")
        def buildCallbackModulePart = new BuildCallbackRequest.ModulePart(
                "c22f321d-d2c6-4ebc-a212-c36740257f9e", BuildCallbackRequest.Status.SUCCESS, [buildCallbackComponentPart]
        )
        def buildCallbackRequest = new BuildCallbackRequest(BuildCallbackRequest.Status.SUCCESS, [buildCallbackModulePart])
        def author = new User("0d2260ff-9a4c-425c-9402-c43cfda97b92", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def build = getDummyBuild("46ecf2cb-62a5-4978-90dc-3bce0d48cabd", author, BuildStatusEnum.BUILDING, DeploymentStatusEnum.NOT_DEPLOYED)

        when:
        this.buildCallbackInteractor.execute(buildId, buildCallbackRequest)

        then:
        1 * this.buildRepository.findById(_) >> { argument ->
            def id = argument[0]

            assert id == buildId
            assert id instanceof String

            return Optional.of(build)
        }

        1 * this.buildRepository.updateStatus(_, _) >> { argument ->
            def id = argument[0]
            def status = argument[1]

            assert id instanceof String
            assert status instanceof BuildStatusEnum

            assert id == buildId
            assert status == BuildStatusEnum.BUILT
        }

        1 * this.buildRepository.saveArtifacts(_) >> { argument ->
            def artifacts = argument[0]

            assert artifacts instanceof List<ArtifactSnapshot>
            assert artifacts[0].id != null
            assert !artifacts.isEmpty()
            assert artifacts[0].createdAt != null
            assert artifacts[0].artifact == buildCallbackRequest.modules[0].components[0].name
            assert artifacts[0].version == buildCallbackRequest.modules[0].components[0].tagName
        }

        notThrown()
    }

    def "when artifact snapshot already exists should not throw an exception"() {
        given:
        def buildId = "5ac7c34a-33dc-4bde-8161-e84d829561bb"
        def buildCallbackComponentPart = new BuildCallbackRequest.ComponentPart("Component snapshot name", "v-1.0.0")
        def buildCallbackModulePart = new BuildCallbackRequest.ModulePart(
                "c22f321d-d2c6-4ebc-a212-c36740257f9e", BuildCallbackRequest.Status.SUCCESS, [buildCallbackComponentPart]
        )
        def buildCallbackRequest = new BuildCallbackRequest(BuildCallbackRequest.Status.SUCCESS, [buildCallbackModulePart])
        def author = new User("0d2260ff-9a4c-425c-9402-c43cfda97b92", "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
        def build = getDummyBuild("46ecf2cb-62a5-4978-90dc-3bce0d48cabd", author, BuildStatusEnum.BUILDING, DeploymentStatusEnum.NOT_DEPLOYED)

        when:
        this.buildCallbackInteractor.execute(buildId, buildCallbackRequest)

        then:
        1 * this.buildRepository.findById(_) >> { argument ->
            def id = argument[0]

            assert id == buildId
            assert id instanceof String

            return Optional.of(build)
        }

        1 * this.buildRepository.updateStatus(_, _) >> { argument ->
            def id = argument[0]
            def status = argument[1]

            assert id instanceof String
            assert status instanceof BuildStatusEnum

            assert id == buildId
            assert status == BuildStatusEnum.BUILT
        }

        1 * this.buildRepository.saveArtifacts(_) >> {
            throw new DuplicateKeyException("Unique constraint violation")
        }

        notThrown()
    }

    private static Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'host', 'gateway', 'namespace'))

        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot('fd845a23-5eb9-48dc-ab65-02e2650ed4bd', 'c22f321d-d2c6-4ebc-a212-c36740257f9e',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList,
                workspaceId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def deploymentList = new ArrayList<Deployment>()
        def undeployedAt = deploymentStatusEnum == DeploymentStatusEnum.NOT_DEPLOYED ? LocalDateTime.now() : null
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, undeployedAt))

        def build = new Build('5ac7c34a-33dc-4bde-8161-e84d829561bb', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }
}
