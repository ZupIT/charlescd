package io.charlescd.moove.application.user

import javax.inject.Named

@Named
class PasswordGenerator {
    fun create() : String = "teste123@Teste!"
}
