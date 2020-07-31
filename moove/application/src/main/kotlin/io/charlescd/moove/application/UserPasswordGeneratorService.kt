package io.charlescd.moove.application

import javax.inject.Named
import org.passay.AllowedCharacterRule
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator

@Named
class UserPasswordGeneratorService {
    fun create(): String {
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
        return AllowedCharacterRule.ERROR_CODE
    }

    override fun getCharacters(): String {
        return "!@#$^*()_"
    }
}
