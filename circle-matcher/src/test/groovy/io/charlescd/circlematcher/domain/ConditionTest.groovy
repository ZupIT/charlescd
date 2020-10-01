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

    def "Starts With expression should compare only one value"() {

        given:
        def key = "region"
        def values = ["north", "south"]
        when:

        def expression = Condition.STARTS_WITH.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toStr(getPath(input, 'region')).startsWith(toStr('north'))"
    }
}
