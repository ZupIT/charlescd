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

package io.charlescd.moove.infrastructure.service.client

import feign.Headers
import io.charlescd.moove.infrastructure.configuration.SimpleFeignEncoderConfiguration
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@FeignClient(name = "keycloakFormEncodedClient", url = "\${charlescd.keycloak.serverUrl}", configuration = [SimpleFeignEncoderConfiguration::class])
interface KeycloakFormEncodedClient {

    @PostMapping(
        value = ["/realms/{realm}/protocol/openid-connect/token"],
        consumes = [MediaType.APPLICATION_FORM_URLENCODED_VALUE]
    )
    @Headers("Content-Type: application/x-www-form-urlencoded")
    fun authorizeUser(
        @PathVariable("realm") realm: String,
        @RequestBody params: Map<String, Any>
    )
}
