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

package io.charlescd.moove.application.webhook

import io.charlescd.moove.application.OpCodeEnum
import io.charlescd.moove.application.PatchOperation
import io.charlescd.moove.application.webhook.request.PatchWebhookSubscriptionRequest
import io.charlescd.moove.application.workspace.request.PatchWorkspaceRequest
import io.charlescd.moove.domain.Workspace
import spock.lang.Specification

class PatchWebhookSubscriptionRequestTest extends Specification {

    def "when path does not exist should throw exception"() {
        when:
        patchWebhookSubscriptionRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("Path /testing is not allowed.")

        where:
        patchWebhookSubscriptionRequest << [
                new PatchWebhookSubscriptionRequest([new PatchOperation(OpCodeEnum.REPLACE, "/testing", "test")])
        ]
    }

    def "when path exists but operation is not allowed should throw exception"() {
        when:
        patchWebhookSubscriptionRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("is not allowed.")

        where:
        patchWebhookSubscriptionRequest << [
                new PatchWebhookSubscriptionRequest([new PatchOperation(OpCodeEnum.ADD, "/url", "test")]),
                new PatchWebhookSubscriptionRequest([new PatchOperation(OpCodeEnum.REMOVE, "/apiKey", "test")])
        ]
    }

    def "when path and operations are valid but values are blank, should throw exception"() {
        when:
        patchWebhookSubscriptionRequest.validate()

        then:
        def exception = thrown(IllegalArgumentException)
        exception.message.contains("cannot be empty.")

        where:
        patchWebhookSubscriptionRequest << [
                new PatchWebhookSubscriptionRequest([new PatchOperation(OpCodeEnum.REPLACE, "/events", new ArrayList())])
        ]
    }

    def "when all variables are correct should not throw exception"() {
        when:
        patchWebhookSubscriptionRequest.validate()

        then:
        notThrown()

        where:
        patchWebhookSubscriptionRequest << [
                new PatchWebhookSubscriptionRequest([new PatchOperation(OpCodeEnum.REPLACE, "/events", ["DEPLOY"])])
        ]
    }
}
