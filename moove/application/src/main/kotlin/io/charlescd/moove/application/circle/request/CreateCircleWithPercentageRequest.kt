package io.charlescd.moove.application.circle.request

import io.charlescd.moove.commons.extension.toJsonNode
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.MatcherTypeEnum
import io.charlescd.moove.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.*

class CreateCircleWithPercentageRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val authorId: String,

    @field:Min(1)
    @field:Max(100)
    @field:NotNull
    val percentage: Int
)
{
    fun toDomain(user: User, workspaceId: String) = Circle(
        id = UUID.randomUUID().toString(),
        name = name,
        createdAt = LocalDateTime.now(),
        reference = UUID.randomUUID().toString(),
        author = user,
        matcherType = MatcherTypeEnum.PERCENTAGE,
        defaultCircle = false,
        workspaceId = workspaceId,
        percentage = percentage
    )
}
