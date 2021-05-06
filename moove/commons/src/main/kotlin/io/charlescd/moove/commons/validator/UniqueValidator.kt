package io.charlescd.moove.commons.validator

import org.springframework.beans.factory.annotation.Autowired
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

class UniqueValidator : ConstraintValidator<Unique, String> {

    @Autowired
    lateinit var uniqueValueFieldService: UniqueValueFieldService

    private var fieldName: String? = null

    override fun initialize(unique: Unique) {
        fieldName = unique.fieldName
    }

    override fun isValid(value: String?, p1: ConstraintValidatorContext?): Boolean {
        return !uniqueValueFieldService.fieldValueExists(value!!, this.fieldName!!)
    }


}
