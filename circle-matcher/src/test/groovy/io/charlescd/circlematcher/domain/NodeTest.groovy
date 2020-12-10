package io.charlescd.circlematcher.domain

import io.charlescd.circlematcher.domain.validation.NodeValidator
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

    def "Invalid Rule type when there is no content"() {
        given:
        def node = new Node(NodeType.RULE, LogicalOperatorType.AND, [], null)
        when:
        def valid = node.isValidRuleType()
        then:
        assert !valid
    }

    def "Invalid Rule type when the type is wrong"() {
        given:
        def content = TestUtils.createContent(["email@zup.com.br"])
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [], content)
        when:
        def valid = node.isValidRuleType()
        then:
        assert !valid
    }

    def "Invalid Rule type when there is clauses"() {
        given:
        def content = TestUtils.createContent(["email@zup.com.br"])
        def node = new Node(NodeType.RULE, LogicalOperatorType.AND, [new Node()], content)
        when:
        def valid = node.isValidRuleType()
        then:
        assert !valid
    }

    def "Valid Clause type"() {
        given:
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [new Node()], null)
        when:
        def valid = node.isValidClauseType()
        then:
        assert valid
    }


    def "Invalid Clause type when the type is wrong"() {
        given:
        def node = new Node(NodeType.RULE, LogicalOperatorType.AND, [new Node()], null)
        when:
        def valid = node.isValidClauseType()
        then:
        assert !valid
    }

    def "Invalid Clause type when there is content"() {
        given:
        def content = TestUtils.createContent(["email@zup.com.br"])
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [new Node()], content)
        when:
        def valid = node.isValidClauseType()
        then:
        assert !valid
    }

    def "Invalid Clause type when there no operator"() {
        given:
        def node = new Node(NodeType.CLAUSE, null, [new Node()], null)
        when:
        def valid = node.isValidClauseType()
        then:
        assert !valid
    }

    def "Invalid Clause type when there no clauses"() {
        given:
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [], null)
        when:
        def valid = node.isValidClauseType()
        then:
        assert !valid
    }

    def "Expression with simple rule node"() {
        given:
        def content = new Content("username", "EQUAL", ["email@zup.com.br"])
        def node = new Node(NodeType.RULE, null, [], content)
        when:
        def expression = node.expression()
        then:
        assert expression == "(toStr(getPath(input, 'username')) == toStr('email@zup.com.br'))"
    }

    def "Expression with one clause"() {
        given:
        def content = new Content("username", "EQUAL", ["email@zup.com.br"])
        def node = new Node(NodeType.RULE, null, [], content)
        def nodeClause = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [node], null)
        when:
        def expression = nodeClause.expression()
        then:
        assert expression == "((toStr(getPath(input, 'username')) == toStr('email@zup.com.br'))&&true)"
    }

    def "Expression with more than one clause"() {
        given:
        def contentUsername = new Content("username", "EQUAL", ["email@zup.com.br"])
        def nodeUsername = new Node(NodeType.RULE, null, [], contentUsername)
        def contentAge = new Content("age", "EQUAL", ["35"])
        def nodeAge = new Node(NodeType.RULE, null, [], contentAge)

        def nodeClause = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [nodeUsername, nodeAge], null)
        when:
        def expression = nodeClause.expression()
        then:
        assert expression == "((toStr(getPath(input, 'username')) == toStr('email@zup.com.br'))&&(toStr(getPath(input, 'age')) == toStr(35)))"
    }

    def "Not decomposable node when type is CLAUSE and operator is AND"() {
        given:
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.AND, [new Node()], null)
        when:
        def notDecomposable = node.isNotDecomposable()
        then:
        assert notDecomposable
    }

    def "Not decomposable node when type is RULE"() {
        given:
        def contentUsername = new Content("username", "EQUAL", ["email@zup.com.br"])
        def node = new Node(NodeType.RULE, null, [], contentUsername)
        when:
        def notDecomposable = node.isNotDecomposable()
        then:
        assert notDecomposable
    }

    def "Decomposable node when type is CLAUSE and operator is OR"() {
        given:
        def node = new Node(NodeType.CLAUSE, LogicalOperatorType.OR, [new Node()], null)
        when:
        def decomposable = node.isDecomposable()
        then:
        assert decomposable
    }
}