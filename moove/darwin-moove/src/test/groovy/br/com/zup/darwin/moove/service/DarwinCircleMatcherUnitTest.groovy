/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.moove.api.DarwinMatcherApi
import br.com.zup.darwin.moove.api.request.NodeRequest
import br.com.zup.darwin.moove.service.circle.DarwinCircleMatcher
import spock.lang.Specification

class DarwinCircleMatcherUnitTest extends Specification {

    private DarwinCircleMatcher circleMatcher
    private DarwinMatcherApi darwinMatcherApi = Mock(DarwinMatcherApi)

    def setup() {
        this.circleMatcher = new DarwinCircleMatcher(darwinMatcherApi)
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
        1 * this.darwinMatcherApi.create(_)
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
        1 * this.darwinMatcherApi.update(_, _)
    }

}
