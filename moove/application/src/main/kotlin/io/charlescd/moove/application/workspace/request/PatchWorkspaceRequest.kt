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

package io.charlescd.moove.application.workspace.request

import io.charlescd.moove.application.BasePatchRequest
import io.charlescd.moove.application.OpCodeEnum
import io.charlescd.moove.application.PatchOperation
import io.charlescd.moove.domain.Workspace
import org.springframework.util.Assert

data class PatchWorkspaceRequest(override val patches: List<PatchOperation>) : BasePatchRequest<Workspace>(patches) {

    companion object {
        val paths = listOf(
            "/name",
            "/gitConfigurationId",
            "/registryConfigurationId",
            "/cdConfigurationId",
            "/circleMatcherUrl",
            "/metricConfigurationId"
        )
        val operations = listOf(OpCodeEnum.REPLACE, OpCodeEnum.REMOVE)
    }

    override fun validate() {
        validatePaths()
        validateOperations()
        validateValues()
    }

    private fun validatePaths() {
        patches.forEach { patch ->
            Assert.isTrue(paths.contains(patch.path), "Path ${patch.path} not allowed.")
        }
    }

    private fun validateOperations() {
        patches.forEach { patch ->
            Assert.isTrue(operations.contains(patch.op), "${patch.op} operation not allowed.")
        }
    }

    private fun validateValues() {
        patches.forEach { patch ->
            when {
                patch.path == "/name" && (patch.op == OpCodeEnum.ADD || patch.op == OpCodeEnum.REPLACE) -> {
                    Assert.notNull(patch.value, "Name cannot be null.")
                    Assert.isTrue((patch.value as String).isNotBlank(), "Name cannot be blank.")
                    Assert.isTrue((patch.value.length in 1..50), "Name minimum size is 1 and maximum is 50.")
                }
                patch.path == "/circleMatcherUrl" && (patch.op == OpCodeEnum.ADD || patch.op == OpCodeEnum.REPLACE) -> {
                    Assert.notNull(patch.value, "Circle Matcher URL cannot be null.")
                    Assert.isTrue((patch.value as String).isNotBlank(), "Circle Matcher URL cannot be blank.")
                }
            }
        }
    }
}
