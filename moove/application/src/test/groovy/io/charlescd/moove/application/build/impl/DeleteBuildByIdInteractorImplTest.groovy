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
import io.charlescd.moove.application.build.DeleteBuildByIdInteractor
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.BuildRepository
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteBuildByIdInteractorImplTest extends Specification {

    private DeleteBuildByIdInteractor deleteBuildByIdInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.deleteBuildByIdInteractor = new DeleteBuildByIdInteractorImpl(new BuildService(buildRepository))
    }

    def 'when build does not exist should throw exception'() {
        given:
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def buildId = '23f1eabd-fb57-419b-a42b-4628941e34ec'

        when:
        deleteBuildByIdInteractor.execute(buildId, workspaceId)

        then:
        1 * buildRepository.find(buildId, workspaceId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "build"
        ex.id == buildId
    }

    def 'when build can not be deleted because deployment status is deploying, should throw exception'() {
        given:
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = getDummyUser()

        Build build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYING)

        when:
        deleteBuildByIdInteractor.execute(build.id, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DELETE_DEPLOYED_BUILD
    }

    def 'when build can not be deleted because deployment status is deployed, should throw exception'() {
        given:
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = getDummyUser()

        Build build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        when:
        deleteBuildByIdInteractor.execute(build.id, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DELETE_DEPLOYED_BUILD
    }

    def 'should delete build by id successfully'() {
        given:
        def workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = getDummyUser()

        def build = getDummyBuild(workspaceId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED)

        when:
        deleteBuildByIdInteractor.execute(build.id, workspaceId)

        then:
        1 * buildRepository.find(build.id, workspaceId) >> Optional.of(build)
        1 * buildRepository.delete(build) >> _
    }

    private static User getDummyUser() {
        new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Workspace>(), false, LocalDateTime.now())
    }

    private static Build getDummyBuild(String workspaceId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', 'host', 'gateway'))

        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, workspaceId, '04432b68-6957-4542-ace7-6da7d4bffa98'))

        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003")

        def deploymentList = new ArrayList<Deployment>()
        def undeployedAt = deploymentStatusEnum == DeploymentStatusEnum.NOT_DEPLOYED ? LocalDateTime.now() : null
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, undeployedAt))

        def build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                workspaceId, deploymentList)
        build
    }
}
