/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.commons.extension

import br.com.zup.darwin.commons.representation.*
import br.com.zup.darwin.entity.*

fun User.toRepresentation() = UserRepresentation(
    id = this.id,
    name = this.name,
    email = this.email,
    photoUrl = this.photoUrl,
    applications = this.applications.map { it.toSimpleRepresentation() },
    createdAt = this.createdAt
)

fun User.toSimpleRepresentation() = SimpleUserRepresentation(
    id = this.id,
    name = this.name,
    email = this.email,
    photoUrl = this.photoUrl,
    createdAt = this.createdAt
)

fun Problem.toRepresentation() = ProblemRepresentation(
    id = this.id,
    name = this.name,
    createdAt = this.createdAt,
    hypotheses = this.hypotheses.map { it.toSimpleRepresentation() },
    circlesCount = this.hypotheses.sumBy { it.circles.size },
    description = this.description
)

fun Problem.toSimpleRepresentation() = SimpleProblemRepresentation(
    id = this.id,
    authorName = this.author?.name,
    authorId = this.author?.id,
    name = this.name,
    description = this.description
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
    problem = this.problem.toSimpleRepresentation(),
    author = this.author.toSimpleRepresentation(),
    description = this.description,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() },
    cards = this.cards.map { it.toSimpleRepresentation() },
    builds = this.builds.map { it.toRepresentation() },
    circles = this.circles.map { it.toRepresentation() }
)

fun Hypothesis.toSimpleRepresentation() = SimpleHypothesisRepresentation(
    id = this.id,
    description = this.description,
    name = this.name,
    labels = this.labels.map { it.toSimpleRepresentation() },
    circlesCount = this.circles.size
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

fun Application.toRepresentation() = ApplicationRepresentation(
    id = this.id,
    name = this.name,
    users = this.users.map { it.toSimpleRepresentation() },
    membersCount = this.users.size
)

fun Application.toSimpleRepresentation() = SimpleApplicationRepresentation(
    id = this.id,
    name = this.name,
    membersCount = this.users.size
)