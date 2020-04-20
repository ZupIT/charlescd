/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charles.infrastructure.service

import br.com.zup.charles.domain.*
import br.com.zup.charles.domain.repository.GitConfigurationRepository
import br.com.zup.charles.infrastructure.mapper.GitServiceMapper
import spock.lang.Specification

import java.time.LocalDateTime

class GitHubProviderServiceTest extends Specification {

    private GitConfigurationRepository gitConfigurationRepository = Mock(GitConfigurationRepository)
    private GitHubClientFactory gitHubClientFactory = Mock(GitHubClientFactory)
    private GitHubService gitHubService = new GitHubService(gitHubClientFactory)
    private GitServiceMapper gitServiceMapper = new GitServiceMapper([gitHubService])
    private GitHubProviderService gitHubProviderService = new GitHubProviderService(gitConfigurationRepository, gitServiceMapper)

    private applicationId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
    private author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
            new ArrayList<Application>(), LocalDateTime.now())

    private componentSnapshotList = new ArrayList<ComponentSnapshot>()

    private moduleSnapshotList = new ArrayList<ModuleSnapshot>()

    private featureSnapshotList = new ArrayList<FeatureSnapshot>()

    private Build build

    private gitConfiguration = new GitConfiguration("04432b68-6957-4542-ace7-6da7d4bffa98", "git-config",
            new GitCredentials("04432b68-6957-4542-ace7-6da7d4bffa98", "address", "username", "password", null, GitServiceProvider.GITHUB),
            LocalDateTime.now(), author, applicationId)

    def setup() {
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', '/', 8080, '/health', LocalDateTime.now(), null,
                applicationId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7'))

        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Org/ModuleName', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, '04432b68-6957-4542-ace7-6da7d4bffa98', applicationId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILDING,
                applicationId, [])
    }

//    def "should successfully create release candidate"() {
//
//        when:
//        gitHubProviderService.createReleaseCandidates(build)
//
//        then:
//        1 * gitConfigurationRepository.findById(moduleSnapshotList[0].gitConfigurationId) >> Optional.of(gitConfiguration)
//        1 * gitServiceMapper.getByType(GitServiceProvider.GITHUB) >> gitHubService
//        1 * gitHubService.createBranch(gitConfiguration.credentials, moduleSnapshotList[0].name, "intermediary-tag-name", "master") >> "refs/heads/intermediary-tag-name"
//    }
}
