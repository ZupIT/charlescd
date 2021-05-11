package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.ForbiddenExceptionLegacy
import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.repository.SystemTokenRepository
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import org.springframework.beans.factory.annotation.Value
import spock.lang.Specification
import java.time.LocalDateTime

class UserServiceLegacyUnitTest extends Specification {

    private UserRepository userRepository = Mock(UserRepository)
    private SystemTokenRepository systemTokenRepository = Mock(SystemTokenRepository)
    private KeycloakServiceLegacy keycloakServiceLegacy = Mock(KeycloakServiceLegacy)
    private Boolean internalIdmEnabled = true
    private UserServiceLegacy userServiceLegacy
    private String defaultRootUser = "charlesadmin@admin"

    void setup() {
        this.userServiceLegacy = new UserServiceLegacy(userRepository, systemTokenRepository, keycloakServiceLegacy, internalIdmEnabled, defaultRootUser)
    }

    void "when requested a user should be successfully and return them"() {
        given:
        def userId = "1"
        def userEmail = "teste@teste.com"
        def user = new User(userId, "Teste", userEmail, "http://teste.com", true, null, LocalDateTime.now())

        when:
        this.userServiceLegacy.findUser(userId)

        then:
        1 * this.userRepository.findById(userId) >> Optional.of(user)

        notThrown()
    }

    void "when requested a user and not exist should throw NotFoundExceptionLegacy"() {
        given:
        def userId = "1"

        when:
        this.userServiceLegacy.findUser(userId)

        then:
        1 * this.userRepository.findById(userId) >> Optional.empty()

        thrown(NotFoundExceptionLegacy)
    }

    void "when the deletion is of the default root charles user should throw forbidden"() {
        given:
        def userId = "1"
        def user = new User(userId, "Charles Admin", defaultRootUser, "http://teste.com", true, null, LocalDateTime.now())
        when:
        this.userServiceLegacy.delete(userId, authorization)

        then:
        1 * this.userRepository.findById(userId) >> Optional.of(user)
        1 * this.keycloakServiceLegacy.getEmailByAuthorizationToken(authorization) >> user.email
        1 * this.userRepository.findByEmail(user.email) >> Optional.of(user)
        thrown(ForbiddenExceptionLegacy)
    }

    static String getAuthorization() {
        return "Bearer eydGF0ZSI6ImE4OTZmOGFhLTIwZDUtNDI5Ny04YzM2LTdhZWJmZ_qq3"
    }

}
