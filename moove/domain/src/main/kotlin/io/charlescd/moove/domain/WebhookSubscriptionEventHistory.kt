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

data class WebhookSubscriptionEventHistory(
    val executionId: String,
    val subscription: WebhookSubscriptionInfo,
    val status: String,
    val event: WebhookEventInfo,
    val executions: List<WebhookExecutionInfo>
)

data class WebhookSubscriptionInfo(
    val id: String,
    val description: String,
    val url: String,
    val workspaceId: String
)

data class WebhookEventInfo(
    val type: String,
    val content: String
)

data class WebhookExecutionInfo(
    val executionLog: String,
    val status: String,
    val loggedAt: LocalDateTime
)
