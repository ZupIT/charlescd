/*
 *
 *  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *     http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

package io.charlescd.moove.application

import javax.inject.Named
import org.passay.AllowedCharacterRule
import org.passay.CharacterData
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator

@Named
class UserPasswordGeneratorService() {
    fun create(userPasswordFormat: UserPasswordFormat): String {
        val rules = listOf(
            CharacterRule(EnglishCharacterData.LowerCase, userPasswordFormat.numberLowerCase),
            CharacterRule(EnglishCharacterData.UpperCase, userPasswordFormat.numberUpperCase),
            CharacterRule(EnglishCharacterData.Digit, userPasswordFormat.numberDigits),
            CharacterRule(SpecialChars(), userPasswordFormat.numberSpecialChars)
        )
        return PasswordGenerator().generatePassword(userPasswordFormat.passwordLength, rules)
    }
}

class SpecialChars(private val specialChars: String = "!@#$^*()_") : CharacterData {
    override fun getErrorCode(): String {
        return AllowedCharacterRule.ERROR_CODE
    }

    override fun getCharacters(): String {
        return specialChars
    }
}
