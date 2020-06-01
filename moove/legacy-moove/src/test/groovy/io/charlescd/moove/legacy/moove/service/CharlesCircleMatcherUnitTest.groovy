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

package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.legacy.moove.api.CharlesMatcherApi
import io.charlescd.moove.legacy.moove.api.request.NodeRequest
import io.charlescd.moove.legacy.moove.service.circle.CharlesCircleMatcher
import spock.lang.Specification

class CharlesCircleMatcherUnitTest extends Specification {

    private CharlesCircleMatcher circleMatcher
    private CharlesMatcherApi charlesMatcherApi = Mock(CharlesMatcherApi)

    def setup() {
        this.circleMatcher = new CharlesCircleMatcher(charlesMatcherApi)
    }

    def 'should create a matcher rule'() {
        given:
        def value = "user@zup.com.br"
        def valueList = new ArrayList()
        valueList.add(value)

        def rule = new NodeRequest.Node.RuleRequest("username", "EQUAL", valueList)
        def request = new NodeRequest.Node(NodeRequest.Node.NodeTypeRequest.RULE, NodeRequest.Node.LogicalOperatorRequest.OR, null, rule)

        when:
        this.circleMatcher.create("fake-circle-name", request, "reference", "fake-circle-id", "SIMPLE_KV")

        then:
        1 * this.charlesMatcherApi.create(_)
    }

    def 'should update a matcher rule'() {
        given:
        def value = "user@zup.com.br"
        def valueList = new ArrayList()
        valueList.add(value)

        def rule = new NodeRequest.Node.RuleRequest("username", "EQUAL", valueList)
        def request = new NodeRequest.Node(NodeRequest.Node.NodeTypeRequest.RULE, NodeRequest.Node.LogicalOperatorRequest.OR, null, rule)

        when:
        this.circleMatcher.update("fake-circle-name", request, "previousReference", "reference", "fake-circle-id", "SIMPLE_KV")

        then:
        1 * this.charlesMatcherApi.update(_, _)
    }
}
