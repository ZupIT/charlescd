package io.charlescd.moove.application.user

interface UserPasswordGenerator {
    fun create(): String
}
