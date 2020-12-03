package io.charlescd.circlematcher.domain.validation


import io.charlescd.circlematcher.utils.TestUtils
import spock.lang.Specification

class NodeValidationTest extends Specification {

    def "Validate simple RULE node type"() {

        given:
        def value = "user@zup.com.br"
        def values = new ArrayList()
        values.add(value)

        def content = TestUtils.createContent(values)
        def node = TestUtils.createNode(content)
        when:
        def validator = new NodeValidator()
        def valid = validator.isValid(node, null)
        then:
        assert valid
    }
}