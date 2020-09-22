package io.charlescd.moove.application.user.request

import io.charlescd.moove.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.constraints.NotBlank

data class CreateUserRequest(
    @field:NotBlank
    val name: String,

    @field:NotBlank
    val password: String,

    @field:NotBlank
    val email: String,

    val photoUrl: String?,

    val isRoot: Boolean?
) {
    fun toUser() = User(
        id = UUID.randomUUID().toString(),
        name = name,
        email = email.toLowerCase().trim(),
        photoUrl = photoUrl,
        root = this.isRoot ?: false,
        createdAt = LocalDateTime.now()
    )
}
