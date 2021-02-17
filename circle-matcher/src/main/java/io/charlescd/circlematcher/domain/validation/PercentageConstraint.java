package io.charlescd.circlematcher.domain.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;

@Documented
@Constraint(validatedBy = PercentageValidator.class)
@Target({ElementType.TYPE, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PercentageConstraint {
    String message() default "Percentage must be between 0 and 100";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
