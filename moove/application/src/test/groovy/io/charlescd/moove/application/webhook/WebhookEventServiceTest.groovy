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

package io.charlescd.moove.application.webhook

import feign.FeignException
import io.charlescd.moove.application.BuildService
import io.charlescd.moove.application.WebhookEventService
import io.charlescd.moove.domain.*
import io.charlescd.moove.domain.repository.BuildRepository
import io.charlescd.moove.infrastructure.service.HermesClientService
import io.charlescd.moove.infrastructure.service.client.HermesClient
import io.charlescd.moove.infrastructure.service.client.HermesPublisherClient
import io.charlescd.moove.infrastructure.service.client.request.HermesPublishSubscriptionEventRequest
import spock.lang.Specification

import java.time.LocalDateTime

class WebhookEventServiceTest extends Specification {

    private WebhookEventService webhookEventService

    private HermesClient hermesClient = Mock(HermesClient)
    private HermesPublisherClient hermesPublisherClient = Mock(HermesPublisherClient)
    private BuildRepository buildRepository = Mock(BuildRepository)

    void setup() {
        this.webhookEventService = new WebhookEventService(new HermesClientService(hermesClient, hermesPublisherClient), new BuildService(buildRepository))
    }

    def "when hermes response with success notify with success"() {
        when:
        webhookEventService.notifyDeploymentEvent(
                "workspaceId",
                WebhookEventTypeEnum.DEPLOY,
                WebhookEventSubTypeEnum.START_DEPLOY,
                WebhookEventStatusEnum.SUCCESS,
                deployment,
                null
        )

        then:
        1 * this.buildRepository.findById(buildId) >> Optional.of(build)
        1 * this.hermesPublisherClient.notifyEvent(_)
        notThrown()
    }

    def "when hermes response with error event not sent but not throw error"() {
        when:
        webhookEventService.notifyDeploymentEvent(
                "workspaceId",
                WebhookEventTypeEnum.DEPLOY,
                WebhookEventSubTypeEnum.START_DEPLOY,
                WebhookEventStatusEnum.SUCCESS,
                deployment,
                null
        )

        then:
        1 * this.buildRepository.findById(buildId) >> Optional.of(build)
        1 * this.hermesPublisherClient.notifyEvent(_) >> { throw new Exception("Server error") }
        notThrown()
    }


    private static List<String> getEvents() {
        def events = new ArrayList()
        events.add("DEPLOY")
        return events
    }

    private static String getAuthorEmail() {
        return "email@email.com"
    }

    private static User getAuthor(boolean root) {
        return new User("f52f94b8-6775-470f-bac8-125ebfd6b636", "charlescd", authorEmail, "http://image.com.br/photo.png",
                [], root, LocalDateTime.now())
    }


    private static String getWorkspaceId() {
        return "workspaceId"
    }

    private static String getBuildId() {
        return "buildId"
    }

    private static Deployment getDeployment() {
        new Deployment(
                "deploymentId",
                user,
                LocalDateTime.now(),
                LocalDateTime.now(),
                DeploymentStatusEnum.DEPLOYED,
                circle,
                buildId,
                workspaceId,
                null
        )
    }

    private static User getUser() {
        new User(
                'userId',
                'User name',
                'user@email.com',
                'user.photo.png',
                new ArrayList<WorkspacePermissions>(),
                false,
                LocalDateTime.now()
        )
    }

    private static Circle getCircle() {
        new Circle(
                "circleId",
                "Women",
                "9d109f66-351b-426d-ad69-a49bbc329914",
                user,
                LocalDateTime.now(),
                MatcherTypeEnum.REGULAR,
                null,
                0,
                null,
                true,
                workspaceId,
                false,
                null
        )
    }

    private static Build getBuild() {
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
                'Feature name', 'feature-branch-name', LocalDateTime.now(), user.name, user.id, moduleSnapshotList, '23f1eabd-fb57-419b-a42b-4628941e34ec'))

        def circle = new Circle('f8296cfc-6ae1-11ea-bc55-0242ac130003', 'Circle name', 'f8296df6-6ae1-11ea-bc55-0242ac130003',
                user, LocalDateTime.now(), MatcherTypeEnum.SIMPLE_KV, null, null, null, false, "1a58c78a-6acb-11ea-bc55-0242ac130003", false, null)

        def deploymentList = new ArrayList<Deployment>()

        deploymentList.add(new Deployment('f8296aea-6ae1-11ea-bc55-0242ac130003', user, LocalDateTime.now().minusDays(1),
                LocalDateTime.now(), DeploymentStatusEnum.DEPLOYED, circle, '23f1eabd-fb57-419b-a42b-4628941e34ec', workspaceId, null))

        def build = new Build('23f1eabd-fb57-419b-a42b-4628941e34ec', user, LocalDateTime.now(), featureSnapshotList,
                'tag-name', '6181aaf1-10c4-47d8-963a-3b87186debbb', 'f53020d7-6c85-4191-9295-440a3e7c1307', BuildStatusEnum.BUILT,
                workspaceId, deploymentList)
        build
    }
}
