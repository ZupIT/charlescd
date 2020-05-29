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

package io.charlescd.moove.security

data class SecurityConstraints(
    var publicConstraints: List<OpenConstraints> = emptyList(),
    var constraints: List<SecuredConstraints> = emptyList()
)

data class OpenConstraints(
    var pattern: String = "",
    var methods: List<String> = emptyList()
)

data class SecuredConstraints(
    var pattern: String = "",
    var roles: Map<String, List<String>> = emptyMap()
)
