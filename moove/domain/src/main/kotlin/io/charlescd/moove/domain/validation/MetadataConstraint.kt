package io.charlescd.moove.domain.validation

import java.lang.annotation.Documented
import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Documented
@Constraint(validatedBy =[MetadataValidator::class])
    @Target( AnnotationTarget.FIELD)
    @Retention(AnnotationRetention.RUNTIME)
    annotation class MetadataConstraint(
    val message: String = "Invalid metadata",
    val groups: Array<KClass<Any>> = [],
    val payload: Array<KClass<Payload>> = []
)
