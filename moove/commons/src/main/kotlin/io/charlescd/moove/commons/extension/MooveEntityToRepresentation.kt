/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.commons.extension

import io.charlescd.moove.commons.representation.*
import io.charlescd.moove.legacy.repository.entity.*

fun User.toRepresentation() = UserRepresentation(
    id = this.id,
    name = this.name,
    email = this.email,
    photoUrl = this.photoUrl,
    isRoot = this.isRoot,
    createdAt = this.createdAt
)

fun User.toSimpleRepresentation() = SimpleUserRepresentation(
    id = this.id,
    name = this.name,
    email = this.email,
    photoUrl = this.photoUrl,
    createdAt = this.createdAt
)

fun Label.toRepresentation(): LabelRepresentation =
    LabelRepresentation(
        id = this.id,
        name = this.name,
        createdAt = this.createdAt,
        author = this.author.toSimpleRepresentation(),
        hexColor = this.hexColor
    )

fun Label.toSimpleRepresentation() = SimpleLabelRepresentation(
    id = this.id,
    name = this.name,
    hexColor = this.hexColor,
    authorId = this.author.id,
    authorName = this.author.name
)

fun Hypothesis.toRepresentation() = HypothesisRepresentation(
    id = this.id,
    author = this.author.toSimpleRepresentation(),
    description = this.description,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() },
    cards = this.cards.map { it.toSimpleRepresentation() },
    builds = this.builds.map { it.toRepresentation() }
)

fun Hypothesis.toSimpleRepresentation() = SimpleHypothesisRepresentation(
    id = this.id,
    description = this.description,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() }
)

fun SoftwareCard.buildSoftwareCardSimpleRepresentation(): SimpleCardRepresentation = SimpleCardRepresentation(
    id = this.id,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() },
    createdAt = this.createdAt,
    type = this.type.name,
    members = this.members.map { it.toRepresentation() },
    hypothesisId = this.hypothesis.id,
    feature = this.feature.toSimpleRepresentation(),
    index = this.index
)

fun ActionCard.buildActionCardSimpleRepresentation(): SimpleCardRepresentation = SimpleCardRepresentation(
    id = this.id,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() },
    createdAt = this.createdAt,
    type = this.type.name,
    members = this.members.map { it.toRepresentation() },
    hypothesisId = this.hypothesis.id,
    feature = null,
    index = this.index
)

fun Card.toSimpleRepresentation(): SimpleCardRepresentation {
    return when (this) {
        is SoftwareCard -> buildSoftwareCardSimpleRepresentation()
        is ActionCard -> buildActionCardSimpleRepresentation()
        else -> throw throw IllegalArgumentException("Type not supported")
    }
}

fun Card.toRepresentation(): CardRepresentation {
    return when (this) {
        is SoftwareCard -> CardRepresentation(
            id = this.id,
            name = this.name,
            description = this.description,
            column = this.column.toRepresentation(),
            author = this.author.toSimpleRepresentation(),
            labels = this.labels.map { it.toSimpleRepresentation() },
            createdAt = this.createdAt,
            type = this.type.name,
            feature = this.feature.toRepresentation(),
            members = this.members.map { it.toRepresentation() },
            comments = this.comments.map { it.toRepresentation() },
            hypothesisId = this.hypothesis.id,
            index = this.index
        )
        is ActionCard -> CardRepresentation(
            id = this.id,
            name = this.name,
            description = this.description,
            column = this.column.toRepresentation(),
            author = this.author.toSimpleRepresentation(),
            labels = this.labels.map { it.toSimpleRepresentation() },
            createdAt = this.createdAt,
            type = this.type.name,
            feature = null,
            members = this.members.map { it.toRepresentation() },
            comments = this.comments.map { it.toRepresentation() },
            hypothesisId = this.hypothesis.id,
            index = this.index
        )
        else -> throw throw IllegalArgumentException("Type not supported")
    }
}

fun CardColumn.toRepresentation() = CardColumnRepresentation(
    id = this.id,
    name = this.name
)

fun Comment.toRepresentation() = CommentRepresentation(
    id = this.id,
    createdAt = this.createdAt,
    comment = this.comment,
    author = this.author.toSimpleRepresentation()
)

fun Workspace.toRepresentation() = WorkspaceRepresentation(
    id = this.id,
    name = this.name,
    users = this.users.map { it.toSimpleRepresentation() },
    membersCount = this.users.size
)

fun Workspace.toSimpleRepresentation() = SimpleWorkspaceRepresentation(
    id = this.id,
    name = this.name,
    membersCount = this.users.size
)
