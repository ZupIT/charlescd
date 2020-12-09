package io.charlescd.circlematcher.domain

import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

class NodeTest extends Specification {

    def "Valid Rule type when clauses is null"() {

        given:
        def content = TestUtils.createContent(["email@zup.com.br"])
        def node = new Node(NodeType.RULE, LogicalOperatorType.AND, null, content)
        when:
        def valid = node.isValidRuleType()
        then:
        assert valid
    }

    def "Valid Rule type when clauses is empty"() {

        given:
        def content = TestUtils.createContent(["email@zup.com.br"])
        def node = new Node(NodeType.RULE, LogicalOperatorType.AND, [], content)
        when:
        def valid = node.isValidRuleType()
        then:
        assert valid
    }

}