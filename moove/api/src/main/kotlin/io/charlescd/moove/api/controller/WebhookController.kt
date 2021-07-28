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

package io.charlescd.moove.api.controller

import io.charlescd.moove.application.webhook.*
import io.charlescd.moove.application.webhook.request.CreateWebhookSubscriptionRequest
import io.charlescd.moove.application.webhook.request.PatchWebhookSubscriptionRequest
import io.charlescd.moove.application.webhook.response.CreateWebhookSubscriptionResponse
import io.charlescd.moove.application.webhook.response.EventHistoryWebhookSubscriptionResponse
import io.charlescd.moove.application.webhook.response.HealthCheckWebhookSubscriptionResponse
import io.charlescd.moove.application.webhook.response.WebhookSubscriptionResponse
import io.charlescd.moove.domain.PageRequest
import io.swagger.annotations.ApiImplicitParam
import io.swagger.annotations.ApiOperation
import javax.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/webhooks")
class WebhookController(
    private val createWebhookSubscriptionInteractor: CreateWebhookSubscriptionInteractor,
    private val updateWebhookSubscriptionInteractor: UpdateWebhookSubscriptionInteractor,
    private val getWebhookSubscriptionInteractor: GetWebhookSubscriptionInteractor,
    private val deleteWebhookSubscriptionInteractor: DeleteWebhookSubscriptionInteractor,
    private val healthCheckWebhookSubscriptionInteractor: HealthCheckWebhookSubscriptionInteractor,
    private val eventHistoryWebhookSubscriptionInteractor: EventHistoryWebhookSubscriptionInteractor
) {

    @ApiOperation(value = "Create a subscribe webhook")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun subscribe(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @Valid @RequestBody request: CreateWebhookSubscriptionRequest
    ): CreateWebhookSubscriptionResponse {
        return createWebhookSubscriptionInteractor.execute(workspaceId, authorization, token, request)
    }

    @ApiOperation(value = "Get a subscription webhook")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun getSubscription(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("id") id: String
    ): WebhookSubscriptionResponse {
        return getWebhookSubscriptionInteractor.execute(workspaceId, authorization, token, id)
    }

    @ApiOperation(value = "Update a subscription webhook")
    @ApiImplicitParam(
        name = "request",
        value = "Patch Webhook",
        required = true,
        dataType = "PatchWebhookSubscriptionRequest"
    )
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateSubscription(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("id") id: String,
        @Valid @RequestBody request: PatchWebhookSubscriptionRequest
    ): WebhookSubscriptionResponse {
        return updateWebhookSubscriptionInteractor.execute(workspaceId, authorization, token, id, request)
    }

    @ApiOperation(value = "Delete a subscription webhook")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteSubscription(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("id") id: String
    ) {
        deleteWebhookSubscriptionInteractor.execute(workspaceId, authorization, token, id)
    }

    @ApiOperation(value = "Health check from a subscription webhook")
    @DeleteMapping("/{id}/health-check")
    @ResponseStatus(HttpStatus.OK)
    fun healthCheck(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("id") id: String
    ): HealthCheckWebhookSubscriptionResponse {
        return healthCheckWebhookSubscriptionInteractor.execute(workspaceId, authorization, token, id)
    }

    @ApiOperation(value = "Webhook event history")
    @GetMapping("/{id}/history")
    @ResponseStatus(HttpStatus.OK)
    fun getSubscriptionEventHistory(
        @RequestHeader("x-workspace-id") workspaceId: String,
        @RequestHeader(value = "Authorization", required = false) authorization: String?,
        @RequestHeader(value = "x-charles-token", required = false) token: String?,
        @PathVariable("id") id: String,
        @RequestParam(value = "eventType", required = false) eventType: String?,
        @RequestParam(value = "eventStatus", required = false) eventStatus: String?,
        @RequestParam(value = "eventField", required = false) eventField: String?,
        @RequestParam(value = "eventValue", required = false) eventValue: String?,
        @Valid pageRequest: PageRequest
    ): List<EventHistoryWebhookSubscriptionResponse> {
        return eventHistoryWebhookSubscriptionInteractor.execute(
            workspaceId,
            authorization,
            token,
            id,
            eventType,
            eventStatus,
            eventField,
            eventValue,
            pageRequest
        )
    }
}
