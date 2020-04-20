/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.application.build.impl

import br.com.zup.charles.application.build.FindAllBuildsInteractor
import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.BuildRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllBuildsInteractorImplTest extends Specification {

    private FindAllBuildsInteractor findAllBuildsInteractor

    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.findAllBuildsInteractor = new FindAllBuildsInteractorImpl(buildRepository)
    }

    def "when no builds exists should return an empty page"() {
        given:
        def tagName = "dummy-tag-name"
        def status = BuildStatusEnum.BUILT
        def applicationId = "b49c3575-c842-4cbb-8d41-bcad7c42091f"
        def pageRequest = new PageRequest()

        def page = new Page<Build>([], pageRequest.page, pageRequest.size, 0)

        when:
        def buildPageResponse = this.findAllBuildsInteractor.execute(tagName, status, applicationId, pageRequest)

        then:
        1 * this.buildRepository.find(_, _, _, _) >> { arguments ->
            def tagNameArg = arguments[0]
            def statusArg = arguments[1]
            def applicationIdArg = arguments[2]
            def pageRequestArg = arguments[3]

            assert tagNameArg == tagName
            assert statusArg == status
            assert applicationIdArg == applicationId
            assert pageRequestArg == pageRequest

            return page
        }

        assert buildPageResponse != null
        assert buildPageResponse.last
        assert buildPageResponse.totalPages == 1
        assert buildPageResponse.content.isEmpty()
        assert buildPageResponse.page == 0

        notThrown()
    }

    def "when builds exists should return a not empty page"() {
        given:
        def tagName = "dummy-tag-name"
        def status = BuildStatusEnum.BUILT
        def pageRequest = new PageRequest()

        def applicationId = "b49c3575-c842-4cbb-8d41-bcad7c42091f"
        def authorId = "7bdbca7a-a0dc-4721-a861-198b238c0e32"

        def author = new User(authorId, "charles", "charles@zup.com.br", "http://charles.com/dummy_photo.jpg", [], LocalDateTime.now())
        def build = getDummyBuild(applicationId, author, BuildStatusEnum.BUILT, DeploymentStatusEnum.NOT_DEPLOYED)

        def page = new Page<Build>([build], pageRequest.page, pageRequest.size, 1)

        when:
        def buildPageResponse = this.findAllBuildsInteractor.execute(tagName, status, applicationId, pageRequest)

        then:
        1 * this.buildRepository.find(_, _, _, _) >> { arguments ->
            def tagNameArg = arguments[0]
            def statusArg = arguments[1]
            def applicationIdArg = arguments[2]
            def pageRequestArg = arguments[3]

            assert tagNameArg == tagName
            assert statusArg == status
            assert applicationIdArg == applicationId
            assert pageRequestArg == pageRequest

            return page
        }

        notThrown()

        assert buildPageResponse != null
        assert buildPageResponse.last
        assert buildPageResponse.totalPages == 1
        assert !buildPageResponse.content.isEmpty()
        assert buildPageResponse.page == 0
        assert buildPageResponse.content[0].status == build.status.name()
        assert buildPageResponse.content[0].createdAt == build.createdAt
        assert buildPageResponse.content[0].id == build.id
        assert buildPageResponse.content[0].tag == build.tag
        assert !buildPageResponse.content[0].deployments.isEmpty()
        assert !buildPageResponse.content[0].features.isEmpty()
    }

    private static Build getDummyBuild(String applicationId, User author, BuildStatusEnum buildStatusEnum, DeploymentStatusEnum deploymentStatusEnum) {
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
