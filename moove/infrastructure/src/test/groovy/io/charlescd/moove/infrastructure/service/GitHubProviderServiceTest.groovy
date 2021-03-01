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

package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.domain.*
import io.charlescd.moove.infrastructure.mapper.GitServiceMapper
import org.eclipse.egit.github.core.Reference
import org.eclipse.egit.github.core.TypedResource
import org.eclipse.egit.github.core.client.GitHubClient
import org.eclipse.egit.github.core.client.GitHubResponse
import spock.lang.Specification

import java.time.LocalDateTime

class GitHubProviderServiceTest extends Specification {

    private GitHubClientFactory gitHubClientFactory = Mock(GitHubClientFactory)
    private GitHubService gitHubService = new GitHubService(gitHubClientFactory)
    private GitServiceMapper gitServiceMapper = new GitServiceMapper([gitHubService])
    private GitHubClient gitHubClient = Mock(GitHubClient)
    private GitHubProviderService gitHubProviderService
    private HttpURLConnection httpURLConnection = Mock(HttpURLConnection)
    private workspaceId = '1a58c78a-6acb-11ea-bc55-0242ac130003'
    private author = new User('4e806b2a-557b-45c5-91be-1e1db909bef6', 'User name', 'user@email.com', 'user.photo.png',
            new ArrayList<WorkspacePermissions>(), true, LocalDateTime.now())
    private componentSnapshotList = new ArrayList<ComponentSnapshot>()
    private moduleSnapshotList = new ArrayList<ModuleSnapshot>()
    private featureSnapshotList = new ArrayList<FeatureSnapshot>()
    private Build build
    private GitCredentials gitCredentials = new GitCredentials("address", "username", "password", null, GitServiceProvider.GITHUB)

    def setup() {
        componentSnapshotList.add(new ComponentSnapshot('70189ffc-b517-4719-8e20-278a7e5f9b33', '20209ffc-b517-4719-8e20-278a7e5f9b00',
                'Component snapshot name', LocalDateTime.now(), null,
                workspaceId, '3e1f3969-c6ec-4a44-96a0-101d45b668e7', "", ""))

        moduleSnapshotList.add(new ModuleSnapshot('3e1f3969-c6ec-4a44-96a0-101d45b668e7', '000f3969-c6ec-4a44-96a0-101d45b668e7',
                'Org/ModuleName', 'https://git-repository-address.com', LocalDateTime.now(), 'https://helm-repository.com',
                componentSnapshotList, workspaceId, '3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6'))

        featureSnapshotList.add(new FeatureSnapshot('3e25a77e-5f14-45f3-9ae7-c25c00ad9ca6', 'cc869c36-311c-4523-ba5b-7b69286e0df4',
                'Feature name', 'feature-branch-name', LocalDateTime.now(), author.name, author.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', author, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILDING,
                workspaceId, [])
        gitHubProviderService = new GitHubProviderService(gitServiceMapper)
    }

    def "should create release successfully"() {
        given:
        def reference = new Reference()
        reference.setObject(new TypedResource())
        reference.setRef("teste")
        reference.setUrl("teste")

        when:
        gitHubProviderService.createReleaseCandidates(build, gitCredentials)

        then:
        4 * gitHubClientFactory.buildGitClient(gitCredentials) >> gitHubClient
        2 * gitHubClient.get(_) >> new GitHubResponse(httpURLConnection, reference)
        3 * gitHubClient.post(_, _, _) >> reference
    }
}
