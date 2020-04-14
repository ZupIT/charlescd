/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.DeleteBuildByIdInteractor
import br.com.zup.charles.domain.Application
import br.com.zup.charles.domain.Build
import br.com.zup.charles.domain.BuildStatusEnum
import br.com.zup.charles.domain.Circle
import br.com.zup.charles.domain.ComponentSnapshot
import br.com.zup.charles.domain.Deployment
import br.com.zup.charles.domain.DeploymentStatusEnum
import br.com.zup.charles.domain.FeatureSnapshot
import br.com.zup.charles.domain.MatcherTypeEnum
import br.com.zup.charles.domain.ModuleSnapshot
import br.com.zup.charles.domain.User
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.darwin.commons.constants.MooveErrorCode
import br.com.zup.exception.handler.exception.BusinessException
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class DeleteBuildByIdInteractorImplTest extends Specification {

    private DeleteBuildByIdInteractor deleteBuildByIdInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.deleteBuildByIdInteractor = new DeleteBuildByIdInteractorImpl(buildRepository)
    }

    def 'when build does not exist should throw exception'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def buildId = '23f1eabd-fb57-419b-a42b-4628941e34ec'

        when:
        deleteBuildByIdInteractor.execute(buildId, applicationId)

        then:
        1 * buildRepository.find(buildId, applicationId) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resource.resource == "build"
        ex.resource.value == buildId
    }

    def 'when build can not be deleted because deployment status is deploying, should throw exception'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        Build build = getDummyBuild(applicationId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYING)

        when:
        deleteBuildByIdInteractor.execute(build.id, applicationId)

        then:
        1 * buildRepository.find(build.id, applicationId) >> Optional.of(build)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DELETE_DEPLOYED_BUILD
    }

    def 'when build can not be deleted because deployment status is deployed, should throw exception'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        Build build = getDummyBuild(applicationId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.DEPLOYED)

        when:
        deleteBuildByIdInteractor.execute(build.id, applicationId)

        then:
        1 * buildRepository.find(build.id, applicationId) >> Optional.of(build)

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.DELETE_DEPLOYED_BUILD
    }

    def 'should delete build by id successfully'() {
        given:
        def applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
        def author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
                new ArrayList<Application>(), LocalDateTime.now())

        def build = getDummyBuild(applicationId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED)

        when:
        deleteBuildByIdInteractor.execute(build.id, applicationId)

        then:
        1 * buildRepository.find(build.id, applicationId) >> Optional.of(build)
        1 * buildRepository.delete(build) >> _
    }

    private Build getDummyBuild(String applicationId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', '/', 8080, '/health', LocalDateTime.now(), null,
                applicationId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7'))

        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, '04432b68-6957-4542-ace7-6da7d4bffa98',
                '38513be4-0523-41b2-96ba-1c30cda33d89', '2bdf37ee-def1-413b-a978-925f9da6d994', applicationId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

        def featureSnapshotList = new ArrayList<FeatureSnapshot>()
        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                author, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null)

        def deploymentList = new ArrayList<Deployment>()
        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', author, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), deploymentStatusEnum, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', applicationId))

        def build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', buildStatusEnum,
                applicationId, deploymentList)
        build
    }
}
