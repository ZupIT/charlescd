package io.charlescd.moove.legacy.moove.service

import io.charlescd.moove.commons.exceptions.NotFoundExceptionLegacy
import io.charlescd.moove.legacy.moove.request.user.AddGroupsRequest
import io.charlescd.moove.legacy.repository.UserRepository
import io.charlescd.moove.legacy.repository.entity.User
import spock.lang.Specification

import java.time.LocalDateTime

class UserServiceLegacyUnitTest extends Specification {

    private UserRepository userRepository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)
    private KeycloakServiceLegacy keycloakServiceLegacy = Mock(KeycloakServiceLegacy)
    private Boolean internalIdmEnabled = true
    private UserServiceLegacy userServiceLegacy

    void setup() {
        this.userServiceLegacy = new UserServiceLegacy(userRepository, keycloakService, keycloakServiceLegacy, internalIdmEnabled)
    }

    void "when request add user to groups should be successfully added"() {
        given:
        def userId = "1"
        def userEmail = "teste@teste.com"
        def user = new User(userId, "Teste", userEmail, "http://teste.com", true, LocalDateTime.now())
        def listGroupIds = ["1"]
        def addGroupRequest = new AddGroupsRequest(listGroupIds)

        when:
        this.userServiceLegacy.addGroupsToUser(userId, addGroupRequest)

        then:
        1 * this.userRepository.findById(userId) >> Optional.of(user)
        1 * this.keycloakService.addGroupsToUser(userEmail, listGroupIds)
        notThrown()

    }

    void "when requested add user not exists should throw NotFoundExceptionLegacy"() {
        given:
        def userId = "1"
        def userEmail = "teste@teste.com"
        def user = new User(userId, "Teste", userEmail, "http://teste.com", true, LocalDateTime.now())
        def listGroupIds = ["1"]
        def addGroupRequest = new AddGroupsRequest(listGroupIds)

        when:
        this.userServiceLegacy.addGroupsToUser(userId, addGroupRequest)

        then:
        1 * this.userRepository.findById(userId) >> Optional.empty()
        0 * this.keycloakService.addGroupsToUser(userEmail, listGroupIds)

        def ex = thrown(NotFoundExceptionLegacy)
        ex.resourceName == "user"
        ex.id == userId


    }
}
