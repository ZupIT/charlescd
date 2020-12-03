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
            return node.getContent() != null;
        } else if(node.getType() == NodeType.CLAUSE) {
            return node.getContent() == null
                    && node.getClauses() != null
                    && node.getClauses().size() > 0
                    && node.getClauses().get(0).getType() == NodeType.RULE
                    && node.getClauses().get(0).getContent() != null;
        } else {
            return false;
        }
    }
}
