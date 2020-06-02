/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.charlescd.moove.legacy.repository.entity

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import javax.persistence.AttributeConverter
import javax.persistence.Converter

@Converter
class GitConfigurationCredentialsConverter : AttributeConverter<GitCredentials, String> {

    override fun convertToDatabaseColumn(gitCredentials: GitCredentials): String? {

        return jacksonObjectMapper().writeValueAsString(gitCredentials)
    }

    override fun convertToEntityAttribute(gitCredentials: String): GitCredentials? {

        if (gitCredentials.isNullOrEmpty()) {
            return null
        }

        return jacksonObjectMapper().readValue(gitCredentials, GitCredentials::class.java)
    }
}
