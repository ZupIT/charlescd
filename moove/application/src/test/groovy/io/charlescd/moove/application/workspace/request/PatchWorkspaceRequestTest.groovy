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

import io.charlescd.moove.application.OpCodeEnum
import io.charlescd.moove.application.PatchOperation
import spock.lang.Specification

class PatchWorkspaceRequestTest extends Specification {

    def "when path does not exist should throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message == "Path /testing not allowed."

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/testing", "test")])
        ]
    }

    def "when path exists but operation is not allowed should throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("operation not allowed.")

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/name", "test")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/gitConfigurationId", "test")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/registryConfigurationId", "test")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/cdConfigurationId", "test")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/circleMatcherUrl", "test")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.ADD, "/metricConfigurationId", "test")])
        ]
    }

    def "when path and operations are valid but values are blank, should throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("cannot be blank.")

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", "")])
        ]
    }

    def "when path and operations are valid but values are null, should throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("cannot be null.")

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", null)]),
        ]
    }

    def "when all variables are correct should not throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        notThrown()

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", "Name")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", "Lorem ipsum dolor sit amet, consectetur adip.")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/gitConfigurationId", "8b3a3427-03aa-4008-9db9-53f47b9c355c")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/gitConfigurationId", "")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/gitConfigurationId", null)]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/circleMatcherUrl", "http://circle-matcher-url.com.br")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/registryConfigurationId", "8b3a3427-03aa-4008-9db9-53f47b9c355c")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/registryConfigurationId", null)]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/cdConfigurationId", "8b3a3427-03aa-4008-9db9-53f47b9c355c")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/cdConfigurationId", null)]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/metricConfigurationId", "8b3a3427-03aa-4008-9db9-53f47b9c355c")]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/metricConfigurationId", null)]),
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REMOVE, "/circleMatcherUrl", null)])
        ]
    }

    def "when name size is incorrect should throw exception"() {
        when:
        patchWorkspaceRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message == "Name minimum size is 1 and maximum is 50."

        where:
        patchWorkspaceRequest << [
                new PatchWorkspaceRequest([new PatchOperation(OpCodeEnum.REPLACE, "/name", "Lorem ipsum dolor sit amet, consectetur adipiscing nam.")]),
        ]
    }
}
