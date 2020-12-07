package io.charlescd.circlematcher.domain.validation

import io.charlescd.circlematcher.domain.NodeType
import org.mockito.Mockito
import spock.lang.Specification

class EnumNamePatternValidationTest extends Specification {

    def "Validate one node type"() {
        given:
        def nodeType = NodeType.RULE
        def enumNameConstraint = Mockito.mock(EnumNameConstraint.class)
        Mockito.when(enumNameConstraint.regexp()).thenReturn("RULE")
        when:
        def validator = new EnumNamePatternValidator()
        validator.initialize(enumNameConstraint)
        then:
        assert validator.isValid(nodeType, null)
    }

    def "Validate two node types"() {
        given:
        def nodeType = NodeType.CLAUSE
        def enumNameConstraint = Mockito.mock(EnumNameConstraint.class)
        Mockito.when(enumNameConstraint.regexp()).thenReturn("CLAUSE|RULE")
        when:
        def validator = new EnumNamePatternValidator()
        validator.initialize(enumNameConstraint)
        then:
        assert validator.isValid(nodeType, null)
    }

    def "Invalid node type"() {
        given:
        def nodeType = NodeType.CLAUSE
        def enumNameConstraint = Mockito.mock(EnumNameConstraint.class)
        Mockito.when(enumNameConstraint.regexp()).thenReturn("UNKNOWN")
        when:
        def validator = new EnumNamePatternValidator()
        validator.initialize(enumNameConstraint)
        then:
        assert !validator.isValid(nodeType, null)
    }

    def "Null is invalid node type"() {
        given:
        def enumNameConstraint = Mockito.mock(EnumNameConstraint.class)
        Mockito.when(enumNameConstraint.regexp()).thenReturn("CLAUSE")
        when:
        def validator = new EnumNamePatternValidator()
        validator.initialize(enumNameConstraint)
        then:
        assert !validator.isValid(null, null)
    }
}