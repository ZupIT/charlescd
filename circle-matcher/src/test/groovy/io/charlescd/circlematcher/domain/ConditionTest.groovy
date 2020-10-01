package io.charlescd.circlematcher.domain

import io.charlescd.circlematcher.infrastructure.OpUtils
import spock.lang.Specification

class ConditionTest extends Specification {

    def "Equal expression should process a single value"() {

        given:
        def key = "email"
        def values = ["email@email.com"]
        when:

        def expression = Condition.EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toStr(getPath(input, 'email')) == toStr('email@email.com')"
    }

    def "Equal expression should behave as contains for multi-value"() {

        given:
        def key = "region"
        def values = ["north", "south", "southeast"]
        when:

        def expression = Condition.EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "['north','south','southeast'].indexOf(getPath(input, 'region')) != -1"
    }

    def "Not Equal expression should process a single value"() {

        given:
        def key = "email"
        def values = ["email@email.com"]
        when:

        def expression = Condition.NOT_EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toStr(getPath(input, 'email')) != toStr('email@email.com')"
    }

    def "Not Equal expression should behave as not contains for multi-value"() {

        given:
        def key = "region"
        def values = ["north", "south"]
        when:

        def expression = Condition.NOT_EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "['north','south'].indexOf(getPath(input, 'region')) >= 0"
    }

    def "Starts With expression should compare only the first value"() {

        given:
        def key = "region"
        def values = ["north", "south"]
        when:

        def expression = Condition.STARTS_WITH.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toStr(getPath(input, 'region')).startsWith(toStr('north'))"
    }

    def "Ends With expression should compare only the first value"() {

        given:
        def key = "region"
        def values = ["north", "south"]
        when:

        def expression = Condition.ENDS_WITH.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toStr(getPath(input, 'region')).endsWith(toStr('north'))"
    }

    def "Less than expression should parse to number and then compare only the first value"() {

        given:
        def key = "age"
        def values = ["43", "32"]
        when:

        def expression = Condition.LESS_THAN.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toNumber(getPath(input, 'age')) < toNumber(43)"
    }

    def "Less than or equal expression should parse to number and then compare only the first value"() {

        given:
        def key = "age"
        def values = ["43", "32"]
        when:

        def expression = Condition.LESS_THAN_OR_EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toNumber(getPath(input, 'age')) <= toNumber(43)"
    }

    def "Greater than expression should parse to number and then compare only the first value"() {

        given:
        def key = "age"
        def values = ["43", "32"]
        when:

        def expression = Condition.GREATER_THAN.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toNumber(getPath(input, 'age')) > toNumber(43)"
    }
}
