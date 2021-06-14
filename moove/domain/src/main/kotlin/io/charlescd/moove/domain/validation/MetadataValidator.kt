package io.charlescd.moove.domain.validation

import io.charlescd.moove.domain.Metadata
import io.charlescd.moove.domain.MetadataScopeEnum
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

class MetadataValidator : ConstraintValidator<MetadataConstraint, Metadata> {
    private val maxKeySize = 64
    private val maxValueSize = 254
    override fun isValid(metadata: Metadata?, context: ConstraintValidatorContext?): Boolean {

        if (metadata == null) {
            return true
        }

        return this.hasValidScope(metadata.scope) && this.hasValidContent(metadata.content)
    }

    private fun hasValidScope(scope: MetadataScopeEnum): Boolean {
        return scope == MetadataScopeEnum.APPLICATION || scope == MetadataScopeEnum.CLUSTER
    }

    private fun hasValidContent(content: Map<String, String>): Boolean {

        val invalidMetadata = content.entries.filter {
             !this.hasValidValue(it.value) || !this.hasValidKey(it.key)
        }
        return hasKeys(content) && invalidMetadata.isEmpty()
    }

    private fun hasValidKey(key: String): Boolean {
        return key.length in 1 until maxKeySize
    }

    private fun hasValidValue(value: String): Boolean {
        return value.length in 0 until maxValueSize
    }

    private fun hasKeys(metadata: Map<String, String>): Boolean {
        return metadata.entries.isNotEmpty()
    }
}
