package io.charlescd.circlematcher.domain.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PercentageValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface PercentageConstraint {
    String message() default "Percentage must be between 0 and 100";
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
