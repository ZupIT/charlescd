package io.charlescd.circlematcher.domain

import spock.lang.Specification

class ConditionTest extends Specification {

    def "Equal expression should process a single value"() {

        given:
        def key = "email"
        def values = ["email@email.com"]
        when:

        def expression = Condition.EQUAL.expression(key, values)

        then:

        assert expression == "toStr(email) == toStr('email@email.com')"
    }

    def "Equal expression should behave as contains for multi-value"() {

        given:
        def key = "region"
        def values = ["north", "south"]
        when:

        def expression = Condition.EQUAL.expression(key, values)

        then:

        assert expression == "['north','south'].indexOf(region) != -1"
    }
}
