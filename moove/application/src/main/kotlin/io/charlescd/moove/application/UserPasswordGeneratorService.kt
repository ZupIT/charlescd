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
import org.passay.CharacterRule
import org.passay.EnglishCharacterData
import org.passay.PasswordGenerator

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

class SpecialChars(private val specialChars: String? = "!@#$^*()_") : org.passay.CharacterData {
    override fun getErrorCode(): String {
        return AllowedCharacterRule.ERROR_CODE
    }

    override fun getCharacters(): String {
        return specialChars!!
    }
}
