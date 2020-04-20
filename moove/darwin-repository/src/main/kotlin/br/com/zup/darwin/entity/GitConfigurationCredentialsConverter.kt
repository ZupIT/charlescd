/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.entity

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