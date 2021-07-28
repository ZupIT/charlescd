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

package io.charlescd.moove.legacy.moove.api.request

data class CreateNotificationRequest(
    val title: String,
    val content: String,
    val group: String,
    val authorAvatar: String?,
    val targets: List<NotificationTargetPart>,
    val referenceFields: Map<String, String>
)

data class NotificationRecipientPart(
    val id: String,
    val address: String
)

data class NotificationTargetPart(
    val type: NotificationType,
    val recipients: List<NotificationRecipientPart>
)

enum class NotificationType { PUSH, DARWIN, SLACK }

enum class NotificationGroup { COMMENT_CARD, MEMBER_CARD, DEPLOYMENT, RELEASE }

data class NotificationProperty(
    val title: String,
    val content: String,
    val group: String
)

enum class NotificationProperties(val title: String, val content: String, val group: NotificationGroup) {
    NEW_RELEASE(
        "charlescd.notification.new.feature.card.title",
        "charlescd.notification.new.feature.card.content",
        NotificationGroup.RELEASE
    ),
    ADD_MEMBER_CARD(
        "charlescd.notification.add.member.card.title",
        "charlescd.notification.add.member.card.content",
        NotificationGroup.MEMBER_CARD
    ),
    ADD_COMMENT_CARD(
        "charlescd.notification.add.comment.card.title",
        "charlescd.notification.add.comment.card.content",
        NotificationGroup.COMMENT_CARD
    ),
    NEW_DEPLOYMENT(
        "charlescd.notification.new.deployment.title",
        "charlescd.notification.new.deployment.content",
        NotificationGroup.DEPLOYMENT
    ),
}
