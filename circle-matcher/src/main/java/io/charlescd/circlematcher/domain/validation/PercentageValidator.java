package io.charlescd.circlematcher.domain.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PercentageValidator implements ConstraintValidator<PercentageConstraint, Integer> {

    @Override
    public void initialize(PercentageConstraint constraintAnnotation) {

    }

    @Override
    public boolean isValid(Integer percentage, ConstraintValidatorContext constraintValidatorContext) {
        if (percentage == null) {
            return true;
        }
        return percentage >= 0 && percentage <= 100;
    }
}
