package io.charlescd.moove.application

class UserPasswordFormat(
    val numberLowerCase: Int = 2,
    val numberUpperCase: Int = 4,
    val numberDigits: Int = 2,
    val numberSpecialChars: Int = 2,
    val passwordLength: Int = 10
)
