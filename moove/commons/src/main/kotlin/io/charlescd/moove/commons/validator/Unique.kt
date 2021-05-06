package io.charlescd.moove.commons.validator

import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
@MustBeDocumented
@Constraint(validatedBy = [UniqueValidator::class])
annotation class Unique(
    val message: String = "Value already registered",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
    val fieldName: String = "",
    val service: KClass<out UniqueValueFieldService>
)
