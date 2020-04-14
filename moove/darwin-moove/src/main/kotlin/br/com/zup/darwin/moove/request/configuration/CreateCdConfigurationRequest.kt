/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.moove.request.configuration

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = CreateSpinnakerCdConfigurationRequest::class, name = "SPINNAKER"),
    JsonSubTypes.Type(value = CreateOctopipeCdConfigurationRequest::class, name = "OCTOPIPE")
)
abstract class CreateCdConfigurationRequest(
    val type: CdTypeEnum,
    open val authorId: String
)

enum class CdTypeEnum {
    SPINNAKER,
    OCTOPIPE
}