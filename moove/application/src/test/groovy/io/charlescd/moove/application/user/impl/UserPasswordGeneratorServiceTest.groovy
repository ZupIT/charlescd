package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserPasswordGeneratorService
import spock.lang.Specification

class UserPasswordGeneratorServiceTest extends Specification {

    private UserPasswordGeneratorService passwordGenerator

    /**
     * ^                 # start-of-string
     * (?=.*[0-9])       # a digit must occur at least once
     * (?=.*[a-z])       # a lower case letter must occur at least once
     * (?=.*[A-Z])       # an upper case letter must occur at least once
     * (?=.*[@#$%^&+=])  # a special character must occur at least once
     * (?=\S+$)          # no whitespace allowed in the entire string
     * .{8,}             # anything, at least eight places though
     * $                 # end-of-string
     */
    private static final String PASSWORD_CHECK = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$^*()_])(?=\\S+\$).{8,}\$"

    void setup() {
        passwordGenerator = new UserPasswordGeneratorService()
    }

    def "shouldGenerateAValidPassword"() {
        given:
        def matchValidation = PASSWORD_CHECK

        when:
        def response = passwordGenerator.create()
        print(response)

        then:
        assert response != null
        assert response.size() == 10
        assert response.matches(matchValidation)

    }

    def "shouldGenerate10ValidPasswords"() {
        given:
        def matchValidation = PASSWORD_CHECK
        def numberOfPasswords = 10

        when:
        def passwords = []
        for (i in 0..numberOfPasswords) {
            passwords.add(passwordGenerator.create())
        }

        then:
        passwords.stream().forEach({ response ->
            println(response)
            assert response.size() == 10
            assert response.matches(matchValidation)
        })
    }
}
