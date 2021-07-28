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
import io.charlescd.moove.infrastructure.service.client.HermesClient
import io.charlescd.moove.infrastructure.service.client.HermesPublisherClient
import io.charlescd.moove.infrastructure.service.client.request.HermesCreateSubscriptionRequest
import io.charlescd.moove.infrastructure.service.client.request.HermesUpdateSubscriptionRequest
import io.charlescd.moove.infrastructure.service.client.response.HermesExecutionInfoResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesHealthCheckSubscriptionResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesSubscriptionCreateResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesSubscriptionEventHistoryResponse
import io.charlescd.moove.infrastructure.service.client.response.HermesSubscriptionResponse
import spock.lang.Specification

import java.time.LocalDateTime

class HermesClientServiceTest extends Specification {

    private HermesClientService hermesService
    private HermesClient hermesClient = Mock(HermesClient)
    private HermesPublisherClient hermesPublisherClient = Mock(HermesPublisherClient)

    def setup() {
        hermesService = new HermesClientService(hermesClient, hermesPublisherClient)
    }

    def 'when creating a subscription, should do it successfully'() {
        given:
        def request = new HermesCreateSubscriptionRequest('https://mywebhook.com.br', 'secret', 'workspaceId',
                'My Webhook', events)
        def subscription = new SimpleWebhookSubscription('https://mywebhook.com.br', 'secret', 'workspaceId',
                'My Webhook', events)
        def response = new HermesSubscriptionCreateResponse("subscriptionId")

        when:
        hermesService.subscribe(authorEmail, subscription)

        then:
        1 * hermesClient.subscribe(authorEmail, request) >> response

    }

    def 'when getting a subscription, should do it successfully'() {

        when:
        hermesService.getSubscription(authorEmail, "subscriptionId")

        then:
        1 * hermesClient.getSubscription(authorEmail, "subscriptionId") >> hermesSubscriptionResponse

    }

    def 'when getting subscriptions by externalId, should do it successfully'() {
        given:
        def response = new ArrayList<HermesSubscriptionResponse>()
        response.add(hermesSubscriptionResponse)

        when:
        hermesService.getSubscriptinsByExternalId(authorEmail, "subscriptionId")

        then:
        1 * hermesClient.getSubscriptionsByExternalId(authorEmail, "subscriptionId") >> response

    }

    def 'when update a subscription, should do it successfully'() {
        given:
        def request = new HermesUpdateSubscriptionRequest(events)

        when:
        hermesService.updateSubscription(authorEmail, "subscriptionId", events)

        then:
        1 * hermesClient.updateSubscription(authorEmail, "subscriptionId", request) >> hermesSubscriptionResponse

    }

    def 'when delete a subscription, should do it successfully'() {

        when:
        hermesService.deleteSubscription(authorEmail, "subscriptionId")

        then:
        1 * hermesClient.deleteSubscription(authorEmail, "subscriptionId")

    }

    def 'when verify subscription healthcheck, should do it successfully'() {

        when:
        hermesService.healthCheckSubscription(authorEmail, "subscriptionId")

        then:
        1 * hermesClient.healthCheckSubscription(authorEmail, "subscriptionId")  >> hermesHealthCheckSubscriptionResponse

    }

    def 'when publish subscription deployment event, should do it successfully'() {
        def deploymentEvent = new WebhookDeploymentEvent(
                "deploymentId",
                WebhookEventSubTypeEnum.START_DEPLOY,
                WebhookEventStatusEnum.SUCCESS,
                LocalDateTime.now(),
                "workspaceId",
                new WebhookDeploymentAuthorEvent("email@email.com", "User"),
                1,
                new WebhookDeploymentCircleEvent("circleId", "Circle"),
                new WebhookDeploymentReleaseEvent("tag", new ArrayList<WebhookDeploymentModuleEvent>(), new ArrayList<WebhookDeploymentFeatureEvent>())
        )

        def event = new WebhookDeploymentEventType(
                "workspaceId",
                WebhookEventTypeEnum.DEPLOY,
                WebhookEventStatusEnum.SUCCESS,
                null,
                deploymentEvent
        )

        when:
        hermesService.notifySubscriptionEvent(event)

        then:
        1 * hermesPublisherClient.notifyEvent(_)

    }

    def 'when get subscription event history, should do it successfully'() {
        given:

        def response = new ArrayList()
        def history = new HermesSubscriptionEventHistoryResponse(
                "executionId",
                "DEPLOY",
                "\"{\\\"subscriptionId\\\":\\\"adsdasasd\\\",\\\"executionId\\\":\\\"qwerty-poiuy-asdf-ghjkl\\\",\\\"event\\\":{\\\"type\\\":\\\"DEPLOY\\\",\\\"status\\\":\\\"SUCCESS\\\",\\\"date\\\":\\\"2020-01-10 22:00:00\\\",\\\"timeExecution\\\":20,\\\"workspaceId\\\":\\\"adosasokdds\\\",\\\"author\\\":{\\\"email\\\":\\\"author@email.com\\\",\\\"name\\\":\\\"athor\\\"},\\\"circle\\\":{\\\"id\\\":\\\"circleId\\\",\\\"name\\\":\\\"circleName\\\"},\\\"release\\\":{\\\"tag\\\":\\\"tag\\\",\\\"modules\\\":[{\\\"id\\\":\\\"moduleId\\\",\\\"name\\\":\\\"moduleName\\\",\\\"componentes\\\":[{\\\"id\\\":\\\"componentId\\\",\\\"name\\\":\\\"componentName\\\"},{\\\"id\\\":\\\"componentId2\\\",\\\"name\\\":\\\"componentName2\\\"}]},{\\\"id\\\":\\\"moduleId2\\\",\\\"name\\\":\\\"moduleName2\\\",\\\"componentes\\\":[{\\\"id\\\":\\\"componentId3\\\",\\\"name\\\":\\\"componentName3\\\"},{\\\"id\\\":\\\"componentId4\\\",\\\"name\\\":\\\"componentName4\\\"}]}],\\\"features\\\":[{\\\"name\\\":\\\"featureA\\\",\\\"branchName\\\":\\\"minha-branchA\\\"},{\\\"name\\\":\\\"featureB\\\",\\\"branchName\\\":\\\"minha-branchB\\\"}]}}}\"",
                "SENDED",
                "subscriptionId",
                new ArrayList<HermesExecutionInfoResponse>()
        )

        response.add(history)

        def pageRequest = new PageRequest()

        when:
        hermesService.getSubscriptionEventHistory(authorEmail, "subscriptionId", "DEPLOY", null, null, null, pageRequest)

        then:
        1 * hermesClient.getSubscription(authorEmail, "subscriptionId") >> hermesSubscriptionResponse
        1 * hermesClient.getSubscriptionEventsHistory(authorEmail, "subscriptionId", "DEPLOY", null, null, null, pageRequest.page, pageRequest.size) >> response

    }


    private static String getAuthorEmail() {
        return "email@email.com"
    }

    private static HermesSubscriptionResponse getHermesSubscriptionResponse() {
        return new HermesSubscriptionResponse("subscriptionId",'https://mywebhook.com.br', 'secret', 'workspaceId',
                'My Webhook', events)
    }

    private static HermesHealthCheckSubscriptionResponse getHermesHealthCheckSubscriptionResponse() {
        return new HermesHealthCheckSubscriptionResponse(200, "OK!")
    }

    private static List<String> getEvents() {
        def events = new ArrayList()
        events.add("DEPLOY")
        return events
    }
}
