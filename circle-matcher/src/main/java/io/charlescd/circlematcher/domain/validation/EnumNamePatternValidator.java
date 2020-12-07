package io.charlescd.circlematcher.domain.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public class EnumNamePatternValidator implements ConstraintValidator<EnumNameConstraint, Enum<?>> {

    private Pattern pattern;

    @Override
    public void initialize(EnumNameConstraint enumNameConstraint) {
        try {
            pattern = Pattern.compile(enumNameConstraint.regexp());
        } catch (PatternSyntaxException patternSyntaxException) {
            throw new IllegalArgumentException("Given regex is invalid", patternSyntaxException);
        }
    }

    @Override
    public boolean isValid(Enum<?> value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        Matcher matcher = pattern.matcher(value.name());
        return matcher.matches();
    }
}
