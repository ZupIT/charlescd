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
        return validate(node);
    }

    private boolean validate(Node node) {
        if (node.getType() == NodeType.CLAUSE) {
            if (node.isValidClauseType()) {
                boolean valid = false;
                for (var clause : node.getClauses()) {
                    valid = validate(clause);
                    if (!valid) {
                        break;
                    }
                }
                return valid;
            }
            return false;
        } else {
            return node.isValidRuleType();
        }
    }
}
