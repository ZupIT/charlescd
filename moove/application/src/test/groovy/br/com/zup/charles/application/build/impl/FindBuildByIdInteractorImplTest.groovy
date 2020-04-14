/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.FindBuildByIdInteractor
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import br.com.zup.exception.handler.exception.NotFoundException
import spock.lang.Specification

import java.time.LocalDateTime

class FindBuildByIdInteractorImplTest extends Specification {

    private FindBuildByIdInteractor findBuildByIdInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.findBuildByIdInteractor = new FindBuildByIdInteractorImpl(buildRepository)
    }

    def "when build does not exists should throw an exception"() {
        given:
        def buildId = "3c25d9d2-ea98-4027-9a74-e8217b1698d2"
        def applicationId = "13727904-b81e-4615-b90c-dd606b6e2a89"

        when:
        this.findBuildByIdInteractor.execute(buildId, applicationId)

        then:
        1 * this.buildRepository.find(_, _) >> { argument ->
            def argId = argument[0]
            def argApplicationId = argument[1]

            assert argId == buildId
            assert argApplicationId == applicationId

            return Optional.empty()
        }

        def exception = thrown(NotFoundException)

        assert exception.resource.resource == "build"
        assert exception.resource.value == buildId
    }

    def "should return build response"() {
        given:
        def buildId = "3c25d9d2-ea98-4027-9a74-e8217b1698d2"
        def applicationId = "13727904-b81e-4615-b90c-dd606b6e2a89"
        def authorId = "7bdbca7a-a0dc-4721-a861-198b238c0e32"

        def author = new User(authorId, "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())

        def dummyBuild = getDummyBuild(applicationId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED)

        when:
        def buildResponse = this.findBuildByIdInteractor.execute(buildId, applicationId)

        then:
        1 * this.buildRepository.find(_, _) >> { argument ->
            def argId = argument[0]
            def argApplicationId = argument[1]

            assert argId == buildId
            assert argApplicationId == applicationId

            return Optional.of(dummyBuild)
        }

        notThrown()

        assert buildResponse != null
        assert buildResponse.id == dummyBuild.id
        assert buildResponse.author.id == dummyBuild.author.id
        assert buildResponse.createdAt == dummyBuild.createdAt
        assert buildResponse.tag == dummyBuild.tag
        assert buildResponse.status == dummyBuild.status.name()
        assert buildResponse.features != null
        assert !buildResponse.features.isEmpty()
        assert buildResponse.features[0].id == dummyBuild.features[0].id
        assert buildResponse.features[0].name == dummyBuild.features[0].name
        assert buildResponse.features[0].createdAt == dummyBuild.features[0].createdAt
        assert buildResponse.features[0].authorId == dummyBuild.features[0].authorId
        assert buildResponse.features[0].authorName == dummyBuild.features[0].authorName
        assert buildResponse.features[0].branchName == dummyBuild.features[0].branchName
        assert buildResponse.features[0].branches[0] == "https://git-repository-address.com/tree/" + dummyBuild.features[0].branchName
        assert buildResponse.features[0].modules[0].id == dummyBuild.features[0].modules[0].id
        assert buildResponse.features[0].modules[0].name == dummyBuild.features[0].modules[0].name
        assert buildResponse.features[0].modules[0].createdAt == dummyBuild.features[0].modules[0].createdAt
        assert buildResponse.features[0].modules[0].gitRepositoryAddress == dummyBuild.features[0].modules[0].gitRepositoryAddress
        assert buildResponse.features[0].modules[0].helmRepository == dummyBuild.features[0].modules[0].helmRepository
        assert buildResponse.features[0].modules[0].gitRepositoryAddress == dummyBuild.features[0].modules[0].gitRepositoryAddress
        assert buildResponse.features[0].modules[0].components[0].id == dummyBuild.features[0].modules[0].components[0].id
        assert buildResponse.features[0].modules[0].components[0].name == dummyBuild.features[0].modules[0].components[0].name
        assert buildResponse.features[0].modules[0].components[0].createdAt == dummyBuild.features[0].modules[0].components[0].createdAt
        assert buildResponse.features[0].modules[0].components[0].contextPath == dummyBuild.features[0].modules[0].components[0].contextPath
        assert buildResponse.features[0].modules[0].components[0].healthCheck == dummyBuild.features[0].modules[0].components[0].healthCheck
        assert buildResponse.features[0].modules[0].components[0].port == dummyBuild.features[0].modules[0].components[0].port
    }

    private Build getDummyBuild(String applicationId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
        def componentSnapshotList = new ArrayList<ComponentSnapshot>()
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', '/', 8080, '/health', LocalDateTime.now(), null,
                applicationId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7'))

        def moduleSnapshotList = new ArrayList<ModuleSnapshot>()
        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Module Snapshot Name', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, '04432b68-6957-4542-ace7-6da7d4bffa98', '38513be4-0523-41b2-96ba-1c30cda33d89', '2bdf37ee-def1-413b-a978-925f9da6d994',
                applicationId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

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
