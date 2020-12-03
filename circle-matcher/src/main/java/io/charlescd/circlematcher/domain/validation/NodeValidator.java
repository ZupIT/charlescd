package io.charlescd.circlematcher.domain.validation;

import io.charlescd.circlematcher.domain.Node;
import io.charlescd.circlematcher.domain.NodeType;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NodeValidator implements ConstraintValidator<NodeConstraint, Node> {

    @Override
    public void initialize(NodeConstraint constraintAnnotation) {}

    @Override
    public boolean isValid(Node node, ConstraintValidatorContext constraintValidatorContext) {
        if(node.getType() == NodeType.RULE) {
            return validateRuleType(node);
        } else if(node.getType() == NodeType.CLAUSE) {
            return validateClauseType(node);
        } else {
            return false;
        }
    }

    private boolean validateRuleType(Node node) {
        return node.getType() == NodeType.RULE && node.getContent() != null;
    }

    private boolean validateClauseType(Node node) {
        return node.getContent() == null
                && node.getClauses() != null
                && node.getClauses().size() > 0
                && validateRuleType(node.getClauses().get(0));
    }
}
