package io.charlescd.circlematcher.domain

import io.charlescd.circlematcher.infrastructure.OpUtils
import spock.lang.Specification

class ConditionTest extends Specification {

    def "Create condition from string"() {

        given:
        def conditionString = "NOT_CONTAINS"
        when:
        def condition = Condition.from(conditionString)
        then:
        assert condition == Condition.NOT_CONTAINS
    }

    def "Return Not_found when no condition found"() {

        given:
        def conditionString = "WRONG_CONDITION"
        when:
        def condition = Condition.from(conditionString)
        then:
        assert condition == Condition.NOT_FOUND
    }

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

        assert expression == "['north','south'].indexOf(getPath(input, 'region')) == -1"
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

    def "Lower than expression should parse to number and then compare only the first value"() {

        given:
        def key = "age"
        def values = ["43", "32"]
        when:

        def expression = Condition.LOWER_THAN.expression(OpUtils.inputValue(key), values)

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

    def "Greater than or equal expression should parse to number and then compare only the first value"() {

        given:
        def key = "age"
        def values = ["43", "32"]
        when:

        def expression = Condition.GREATER_THAN_OR_EQUAL.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "toNumber(getPath(input, 'age')) >= toNumber(43)"
    }

    def "Contains expression should compare the values array"() {

        given:
        def key = "email"
        def values = ["@zup.com.br", "@itau-unibanco.com"]
        when:

        def expression = Condition.CONTAINS.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "(['@zup.com.br','@itau-unibanco.com'].indexOf(toStr(getPath(input, 'email'))) >= 0)"
    }

    def "Contains expression should compare the first value"() {

        given:
        def key = "username"
        def values = ["zup"]
        when:

        def expression = Condition.CONTAINS.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "(getPath(input, 'username').indexOf(toStr('zup')) >= 0)"
    }

    def "Not Contains expression should compare the values array"() {

        given:
        def key = "email"
        def values = ["@zup.com.br", "@itau-unibanco.com"]
        when:

        def expression = Condition.NOT_CONTAINS.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "(['@zup.com.br','@itau-unibanco.com'].indexOf(toStr(getPath(input, 'email'))) < 0)"
    }

    def "Not Contains expression should compare the first value"() {

        given:
        def key = "username"
        def values = ["zup"]
        when:

        def expression = Condition.NOT_CONTAINS.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "(getPath(input, 'username').indexOf(toStr('zup')) < 0)"
    }

    def "Between expression should fail when values if different than 2"() {

        given:
        def key = "age"
        def values = ["25"]
        when:

        Condition.BETWEEN.expression(OpUtils.inputValue(key), values)

        then:

        thrown(IllegalArgumentException)
    }

    def "Between expression should parse to float and then compare against values"() {

        given:
        def key = "age"
        def values = ["25", "35"]
        when:

        def expression = Condition.BETWEEN.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "((getPath(input, 'age') >= parseFloat(25)) && (getPath(input, 'age') <= parseFloat(35)))"
    }

    def "Default expression should fail when values is empty"() {

        given:
        def key = "age"
        def values = []
        when:

        Condition.EQUAL.defaultExpression(OpUtils.inputValue(key), values)

        then:

        thrown(NoSuchElementException)
    }

    def "Matches expression should apply regex only on the first value"() {

        given:
        def key = "email"
        def values = [".+@zup\\.com\\.br\$"]
        when:

        def expression = Condition.MATCHES.expression(OpUtils.inputValue(key), values)

        then:

        assert expression == "/.+@zup\\.com\\.br\$/.test(getPath(input, 'email'))"
    }
}
