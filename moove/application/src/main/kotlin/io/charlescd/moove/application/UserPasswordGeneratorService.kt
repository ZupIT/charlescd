package io.charlescd.moove.application

import org.passay.AllowedCharacterRule
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator
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
        val rules = listOf(
            CharacterRule(EnglishCharacterData.LowerCase, numberLowerCase!!),
            CharacterRule(EnglishCharacterData.UpperCase, numberUpperCase!!),
            CharacterRule(EnglishCharacterData.Digit, numberDigits!!),
            CharacterRule(SpecialChars(), numberSpecialChars!!)
        )
        return PasswordGenerator().generatePassword(passwordLength!!, rules)
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
