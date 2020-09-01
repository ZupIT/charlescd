package io.charlescd.moove.domain

import java.time.LocalDateTime

class WorkspacePermissions(
    val id: String,
    val name: String,
    val permissions: List<Permission>,
    val author: User,
    val createdAt: LocalDateTime,
    val status: WorkspaceStatusEnum = WorkspaceStatusEnum.INCOMPLETE
)
