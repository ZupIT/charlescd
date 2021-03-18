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

package io.charlescd.moove.domain

import java.time.LocalDateTime

data class WebhookDeploymentEventType(
    override val externalId: String,
    override val eventType: WebhookEventTypeEnum,
    override val eventStatus: WebhookEventStatusEnum,
    override val error: String? = null,
    val event: WebhookDeploymentEvent
) : WebhookEvent(
    externalId,
    eventType,
    eventStatus,
    error
)

data class WebhookDeploymentEvent(
    val deploymentId: String,
    val type: WebhookEventSubTypeEnum,
    val status: WebhookEventStatusEnum,
    val date: LocalDateTime?,
    val workspaceId: String,
    val author: WebhookDeploymentAuthorEvent,
    val timeExecution: Long?,
    val circle: WebhookDeploymentCircleEvent,
    val release: WebhookDeploymentReleaseEvent
)

data class WebhookDeploymentCircleEvent(
    val id: String,
    val name: String
)

data class WebhookDeploymentAuthorEvent(
    val email: String,
    val name: String
)

data class WebhookDeploymentReleaseEvent(
    val tag: String,
    val modules: List<WebhookDeploymentModuleEvent>,
    val features: List<WebhookDeploymentFeatureEvent>
)

data class WebhookDeploymentModuleEvent(
    val name: String,
    val components: List<WebhookDeploymentComponentEvent>
)

data class WebhookDeploymentComponentEvent(
    val id: String,
    val name: String
)

data class WebhookDeploymentFeatureEvent(
    val name: String,
    val branchName: String
)
