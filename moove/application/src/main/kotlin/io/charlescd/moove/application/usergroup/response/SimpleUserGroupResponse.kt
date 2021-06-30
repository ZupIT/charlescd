package io.charlescd.moove.application.usergroup.response

import io.charlescd.moove.domain.SimpleUserGroup

data class SimpleUserGroupResponse(
    val id: String,
    val name: String
) {

    companion object {

        fun from(userGroup: SimpleUserGroup): SimpleUserGroupResponse {
            return SimpleUserGroupResponse(
                id = userGroup.id,
                name = userGroup.name
            )
        }
    }
}
