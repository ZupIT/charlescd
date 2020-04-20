/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.api.request

data class CreateNotificationRequest(
    val title: String,
    val content: String,
    val group: String,
    val authorAvatar: String?,
    val targets: List<NotificationTargetPart>,
    val referenceFields: Map<String,String>
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
        "darwin.notification.new.feature.card.title",
        "darwin.notification.new.feature.card.content",
        NotificationGroup.RELEASE
    ),
    ADD_MEMBER_CARD(
        "darwin.notification.add.member.card.title",
        "darwin.notification.add.member.card.content",
        NotificationGroup.MEMBER_CARD
    ),
    ADD_COMMENT_CARD(
        "darwin.notification.add.comment.card.title",
        "darwin.notification.add.comment.card.content",
        NotificationGroup.COMMENT_CARD
    ),
    NEW_DEPLOYMENT(
        "darwin.notification.new.deployment.title",
        "darwin.notification.new.deployment.content",
        NotificationGroup.DEPLOYMENT
    ),
}