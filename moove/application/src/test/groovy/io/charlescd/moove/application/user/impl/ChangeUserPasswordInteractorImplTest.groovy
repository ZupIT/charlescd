package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.ChangeUserPasswordInteractor
import io.charlescd.moove.application.user.request.ChangeUserPasswordRequest
import io.charlescd.moove.application.usergroup.request.AddMemberToUserGroupRequest
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakCustomService
import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

import java.time.LocalDateTime

class ChangeUserPasswordInteractorImplTest extends Specification {

    private ChangeUserPasswordInteractor changeUserPasswordInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)

    void setup() {
        this.changeUserPasswordInteractor = new ChangeUserPasswordInteractorImpl(
                new UserService(userRepository),
                keycloakService
        )
    }

    def "when user does not exist should throw an exception"() {
        given:
        def userEmail = "user-email"
        def authorization = "authorization"
        def request = new ChangeUserPasswordRequest("old-password", "new-password")

        when:
        this.changeUserPasswordInteractor.execute(authorization, request)

        then:
        1 * this.keycloakService.getEmailByAccessToken(authorization) >> userEmail
        1 * this.userRepository.findByEmail(userEmail) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == userEmail
    }

    def "should change user password"() {
        given:
        def userEmail = "user-email"
        def user = getDummyUser(userEmail)
        def authorization = "authorization"
        def request = new ChangeUserPasswordRequest("old-password", "new-password")

        when:
        this.changeUserPasswordInteractor.execute(authorization, request)

        then:
        1 * this.keycloakService.getEmailByAccessToken(authorization) >> userEmail
        1 * this.userRepository.findByEmail(userEmail) >> Optional.of(user)
        1 * this.keycloakService.changeUserPassword(user.email, request.oldPassword, request.newPassword)

        notThrown()
    }

    private User getDummyUser(String email) {
        new User("user-id", "charles", email, "http://charles.com/dummy_photo.jpg", [], false, LocalDateTime.now())
    }

}
