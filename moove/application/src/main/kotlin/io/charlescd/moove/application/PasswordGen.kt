package io.charlescd.moove.application

import org.passay.AllowedCharacterRule
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator

class PasswordGen private constructor(
    private val numberLowerCase: Int? = 2,
    private val numberUpperCase: Int? = 2,
    private val numberDigits: Int? = 2,
    private val numberSpecialChars: Int? = 2,
    private val passwordLength: Int? = 10
) {
    fun create(): String {
        val rules = listOf(
            CharacterRule(EnglishCharacterData.LowerCase, numberLowerCase!!),
            CharacterRule(EnglishCharacterData.UpperCase, numberUpperCase!!),
            CharacterRule(EnglishCharacterData.Digit, numberDigits!!),
            CharacterRule(SpecialChars(), numberSpecialChars!!)
        )
        return PasswordGenerator().generatePassword(passwordLength!!, rules)
    }

    data class Builder(
        var numberLowerCase: Int? = null,
        var numberUpperCase: Int? = null,
        var numberDigits: Int? = null,
        var numberSpecialChars: Int? = null,
        var passwordLength: Int? = null
    ) {

        fun numberLowerCase(numberLowerCase: Int) = apply { this.numberLowerCase = numberLowerCase }
        fun numberUpperCase(numberUpperCase: Int) = apply { this.numberUpperCase = numberUpperCase }
        fun numberDigits(numberDigits: Int) = apply { this.numberDigits = numberDigits }
        fun numberSpecialChars(numberSpecialChars: Int) = apply { this.numberSpecialChars = numberSpecialChars }
        fun passwordLength(passwordLength: Int) = apply { this.passwordLength = passwordLength }
        fun build() = PasswordGen(numberLowerCase, numberUpperCase, numberDigits, numberSpecialChars, passwordLength)
    }
}

class SpecialChars : org.passay.CharacterData {
    override fun getErrorCode(): String {
        return AllowedCharacterRule.ERROR_CODE
    }

    override fun getCharacters(): String {
        return "!@#$^*()_"
    }
}
