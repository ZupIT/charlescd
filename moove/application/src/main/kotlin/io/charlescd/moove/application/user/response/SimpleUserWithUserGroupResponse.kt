package io.charlescd.moove.application.user.response

import com.fasterxml.jackson.annotation.JsonFormat
import io.charlescd.moove.application.usergroup.response.SimpleUserGroupResponse
import io.charlescd.moove.domain.User
import java.time.LocalDateTime

data class SimpleUserWithUserGroupResponse(
    val id: String,
    val name: String,
    val email: String,
    val photoUrl: String?,
    val isRoot: Boolean,
    val userGroups: List<SimpleUserGroupResponse>,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    val createdAt: LocalDateTime
) {
    companion object {
        fun from(user: User): SimpleUserWithUserGroupResponse {
            return SimpleUserWithUserGroupResponse(
                id = user.id,
                name = user.name,
                email = user.email,
                photoUrl = user.photoUrl,
                isRoot = user.root,
                userGroups = user.userGroups.map { SimpleUserGroupResponse.from(it) },
                createdAt = user.createdAt
            )
        }
    }
}
