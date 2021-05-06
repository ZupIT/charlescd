package io.charlescd.moove.commons.validator

interface UniqueValueFieldService {

    @Throws(UnsupportedOperationException::class)
    fun fieldValueExists(value: String, fieldName: String): Boolean
}
