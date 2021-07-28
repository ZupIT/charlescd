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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.moove.api.CharlesNotificationApi
import io.charlescd.moove.legacy.moove.api.request.*
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.*
import org.springframework.cloud.context.environment.EnvironmentManager
import org.springframework.stereotype.Component

@Component
class CharlesNotificationService(
    private val charlesNotificationApi: CharlesNotificationApi,
    private val userRepository: UserRepository,
    private val env: EnvironmentManager
) {

    fun addMembersCard(card: Card, author: User, memberIds: List<String>) {
        // TODO implement
    }

    fun addCommentCard(card: Card, comment: Comment) {
        // TODO implement
    }

    fun newRelease(build: Build) {
        // TODO implement
    }

    fun createDeployment(deployment: Deployment) {
        // TODO implement
    }

    private fun createNotification(
        propertyCreateDeployment: NotificationProperty,
        photoUrl: String?,
        title: String,
        content: String,
        memberIds: List<String>,
        referenceFields: Map<String, String>
    ) {
        this.charlesNotificationApi.create(
            CreateNotificationRequest(
                title = title,
                authorAvatar = photoUrl,
                content = content,
                group = propertyCreateDeployment.group,
                targets = this.createRecipients(memberIds),
                referenceFields = referenceFields
            )
        )
    }

    private fun createTargets(memberIds: List<String>): List<NotificationRecipientPart> =
        memberIds.map { it ->
            userRepository.findById(it)
                .orElseThrow { NotFoundExceptionLegacy("user", it) }
                .let {
                    NotificationRecipientPart(
                        id = it.id,
                        address = it.id
                    )
                }
        }.toList()

    private fun createRecipients(memberIds: List<String>): List<NotificationTargetPart> =
        listOf(
            NotificationTargetPart(
                type = NotificationType.DARWIN,
                recipients = this.createTargets(memberIds)
            )
        )

    private fun getNotificationProperties(notificationProperty: NotificationProperties): NotificationProperty {
        return NotificationProperty(
            title = env.getProperty(notificationProperty.title) as String,
            content = env.getProperty(notificationProperty.content) as String,
            group = notificationProperty.group.toString()
        )
    }
}
