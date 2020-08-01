package io.charlescd.moove.application

import javax.inject.Named

@Named
class UserPasswordGeneratorService(
    val numberLowerCase: Int? = 2,
    val numberUpperCase: Int? = 2,
    val numberDigits: Int? = 2,
    val numberSpecialChars: Int? = 2,
    val passwordLength: Int? = 10
) {
    fun create(): String {
        val passwordGen: PasswordGen = PasswordGen.Builder()
            .numberDigits(numberDigits!!)
            .numberLowerCase(numberLowerCase!!)
            .numberUpperCase(numberUpperCase!!)
            .numberSpecialChars(numberSpecialChars!!)
            .passwordLength(passwordLength!!)
            .build()

        return passwordGen.create()
    }
}
