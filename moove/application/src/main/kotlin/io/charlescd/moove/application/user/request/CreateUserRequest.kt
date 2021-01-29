package io.charlescd.moove.application.user.request

import io.charlescd.moove.domain.User
import java.time.LocalDateTime
import java.util.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size

data class CreateUserRequest(
    @field:NotBlank
    @field:Size(max = 64)
    val name: String,

    @field:Size(max = 100)
    val password: String?,

    @field:NotBlank
    @field:Size(max = 64)
    @field:Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}\$")
    val email: String,

    @field:Size(max = 2048)
    val photoUrl: String?,

    val isRoot: Boolean?
) {
    fun toUser() = User(
        id = UUID.randomUUID().toString(),
        name = name.trim(),
        email = email.toLowerCase().trim(),
        photoUrl = photoUrl?.trim(),
        root = this.isRoot ?: false,
        createdAt = LocalDateTime.now()
    )
}
