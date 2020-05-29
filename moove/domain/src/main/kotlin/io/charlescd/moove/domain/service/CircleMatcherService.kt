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

package io.charlescd.moove.domain.service

import com.fasterxml.jackson.databind.JsonNode
import io.charlescd.moove.domain.Circle
import io.charlescd.moove.domain.SimpleCircle
import io.charlescd.moove.domain.Workspace

interface CircleMatcherService {

    fun create(circle: Circle, matcherUri: String)

    fun update(circle: Circle, previousReference: String, matcherUri: String)

    fun delete(reference: String, matcherUri: String)

    fun createImport(circle: Circle, nodes: List<JsonNode>, matcherUri: String)

    fun updateImport(circle: Circle, previousReference: String, nodes: List<JsonNode>, matcherUri: String)

    fun identify(workspace: Workspace, request: Map<String, Any>): List<SimpleCircle>
}
