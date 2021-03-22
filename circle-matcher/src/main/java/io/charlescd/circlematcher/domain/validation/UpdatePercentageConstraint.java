package io.charlescd.circlematcher.domain.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;

@Documented
@Constraint(validatedBy = UpdatePercentageValidator.class)
@Target({ElementType.TYPE, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UpdatePercentageConstraint {
    String message() default "Invalid percentage";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
