package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.user.UserPasswordGenerator
import javax.inject.Named
import org.passay.AllowedCharacterRule.ERROR_CODE
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator

@Named
class PassayUserPasswordGenerator : UserPasswordGenerator {
    override fun create(): String {
        val rules = listOf(
            CharacterRule(EnglishCharacterData.LowerCase, 2),
            CharacterRule(EnglishCharacterData.UpperCase, 2),
            CharacterRule(EnglishCharacterData.Digit, 2),
            CharacterRule(SpecialChars(), 2)
        )
        return PasswordGenerator().generatePassword(10, rules)
    }
}

class SpecialChars : org.passay.CharacterData {
    override fun getErrorCode(): String {
        return ERROR_CODE
    }

    override fun getCharacters(): String {
        return "!@#$%^&*()_+"
    }
}
