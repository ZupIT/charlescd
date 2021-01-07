package io.charlescd.circlematcher.domain.validation;

import io.charlescd.circlematcher.domain.Node;
import io.charlescd.circlematcher.domain.NodeType;
import java.util.List;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NodeValidator implements ConstraintValidator<NodeConstraint, Node> {

    @Override
    public void initialize(NodeConstraint constraintAnnotation) {}

    @Override
    public boolean isValid(Node node, ConstraintValidatorContext constraintValidatorContext) {
        if(node == null) {
            return true;
        }
        return validate(node);
    }

    private boolean validate(Node node) {
        if (node.getType() == NodeType.CLAUSE) {
            return node.isValidClauseType() && validateClauses(node.getClauses());
        } else {
            return node.isValidRuleType();
        }
    }

    private boolean validateClauses(List<Node> clauses) {
        boolean valid = false;
        for (var clause : clauses) {
            valid = validate(clause);
            if (!valid) {
                break;
            }
        }
        return valid;
    }
}
