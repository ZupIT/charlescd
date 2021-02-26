package io.charlescd.moove.domain

import java.time.LocalDateTime

data class ButlerConfiguration(
    val id: String,
    val name: String,
    val author: User,
    val workspaceId: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val butlerUrl: String,
    val namespace: String,
    val gitToken: String
)
