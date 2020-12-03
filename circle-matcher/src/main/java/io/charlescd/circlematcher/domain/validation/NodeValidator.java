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
        return (node.getType() == NodeType.RULE && node.getContent() != null);
    }
}
