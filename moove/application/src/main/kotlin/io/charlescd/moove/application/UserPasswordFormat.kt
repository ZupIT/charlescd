package io.charlescd.moove.application

class UserPasswordFormat private constructor(
    val numberLowerCase: Int,
    val numberUpperCase: Int,
    val numberDigits: Int,
    val numberSpecialChars: Int,
    val passwordLength: Int
) {

    data class Builder(
        private var numberLowerCase: Int = 2,
        private var numberUpperCase: Int = 2,
        private var numberDigits: Int = 2,
        private var numberSpecialChars: Int = 2
    ) {
        fun numberLowerCase(numberLowerCase: Int) = apply { this.numberLowerCase = numberLowerCase }
        fun numberUpperCase(numberUpperCase: Int) = apply { this.numberUpperCase = numberUpperCase }
        fun numberDigits(numberDigits: Int) = apply { this.numberDigits = numberDigits }
        fun numberSpecialChars(numberSpecialChars: Int) = apply { this.numberSpecialChars = numberSpecialChars }
        fun build(): UserPasswordFormat {
            val totalLength = numberLowerCase + numberUpperCase + numberDigits + numberSpecialChars
            return UserPasswordFormat(numberLowerCase, numberUpperCase, numberDigits, numberSpecialChars, totalLength)
        }
    }
}
