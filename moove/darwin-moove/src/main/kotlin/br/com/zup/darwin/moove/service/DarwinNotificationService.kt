/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.entity.*
import br.com.zup.darwin.moove.api.DarwinNotificationApi
import br.com.zup.darwin.moove.api.request.*
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import br.com.zup.exception.handler.to.ResourceValue
import org.springframework.cloud.context.environment.EnvironmentManager
import org.springframework.stereotype.Component

@Component
class DarwinNotificationService(
    private val darwinNotificationApi: DarwinNotificationApi,
    private val userRepository: UserRepository,
    private val env: EnvironmentManager
) {

    fun addMembersCard(card: Card, author: User, memberIds: List<String>) {
        val propertyMemberCard = this.getNotificationProperties(NotificationProperties.ADD_MEMBER_CARD)
        val title = String.format(propertyMemberCard.title, author.name, card.name)
        val content = String.format(propertyMemberCard.content, card.id)
        val referenceFields = createCardReferenceFields(card)

        this.createNotification(
            propertyMemberCard,
            author.photoUrl,
            title,
            content,
            card.members.filter { it.id != author.id }.map { it.id }.toList(),
            referenceFields
        )
    }

    fun addCommentCard(card: Card, comment: Comment) {
        val propertyCommentCard = this.getNotificationProperties(NotificationProperties.ADD_COMMENT_CARD)
        val title = String.format(propertyCommentCard.title, comment.author.name, card.name)
        val content = String.format(propertyCommentCard.content, comment.id)
        val referenceFields = createCardReferenceFields(card)

        this.createNotification(
            propertyCommentCard,
            comment.author.photoUrl,
            title,
            content,
            card.members.filter { it.id != comment.author.id }.map { it.id }.toList(),
            referenceFields
        )
    }

    fun newRelease(build: Build) {
        val propertyNewRelease = this.getNotificationProperties(NotificationProperties.NEW_RELEASE)
        val title = String.format(propertyNewRelease.title, build.author.name, build.tag)
        val content = String.format(propertyNewRelease.content, build.id)
        val referenceFields = createReferenceFields(build.hypothesis!!)

        this.createNotification(
            propertyNewRelease,
            build.author.photoUrl,
            title,
            content,
            build.features.map { it.author.id }.filter { it != build.author.id }.toList(),
            referenceFields
        )
    }

    fun createDeployment(deployment: Deployment) {
        val propertyCreateDeployment = this.getNotificationProperties(NotificationProperties.NEW_DEPLOYMENT)
        val title = String.format(propertyCreateDeployment.title, deployment.author.name, deployment.build.tag)
        val content = String.format(propertyCreateDeployment.content, deployment.id)
        val referenceFields = createReferenceFields(deployment.build.hypothesis!!)

        this.createNotification(
            propertyCreateDeployment,
            deployment.author.photoUrl,
            title,
            content,
            deployment.build.features.map { it.author.id }.filter { it != deployment.author.id }.toList(),
            referenceFields
        )
    }

    private fun createNotification(
        propertyCreateDeployment: NotificationProperty,
        photoUrl: String?,
        title: String,
        content: String,
        memberIds: List<String>,
        referenceFields: Map<String, String>
    ) {
        this.darwinNotificationApi.create(
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
                .orElseThrow { NotFoundException(ResourceValue("user", it)) }
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

    private fun createCardReferenceFields(card: Card): Map<String, String> {
        return mapOf(
            "hypothesis" to card.hypothesis.id,
            "problems" to card.hypothesis.problem.id,
            "card" to card.id
        )
    }

    private fun createReferenceFields(hypothesis: Hypothesis): Map<String, String> {
        return mapOf(
            "hypothesis" to hypothesis.id,
            "problems" to hypothesis.problem.id
        )
    }
}

