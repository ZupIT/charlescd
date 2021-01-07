package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.ChangeUserPasswordInteractor
import io.charlescd.moove.application.user.request.ChangeUserPasswordRequest
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import spock.lang.Specification

class ChangeUserPasswordInteractorImplTest extends Specification {

    private ChangeUserPasswordInteractor changeUserPasswordInteractor

    private UserRepository userRepository = Mock(UserRepository)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)

    void setup() {
        this.changeUserPasswordInteractor = new ChangeUserPasswordInteractorImpl(
                new UserService(userRepository, managementUserSecurityService),
        )
    }

    def "when user does not exist should throw an exception"() {
        given:
        def userEmail = TestUtils.user.email
        def authorization = TestUtils.authorization
        def request = new ChangeUserPasswordRequest("old-password", "new-password")

        when:
        this.changeUserPasswordInteractor.execute(authorization, request)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> userEmail
        1 * this.userRepository.findByEmail(userEmail) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == userEmail
    }

    def "should change user password"() {
        given:
        def user = TestUtils.user
        def userEmail = user.email
        def authorization = TestUtils.authorization
        def request = new ChangeUserPasswordRequest("old-password", "new-password")

        when:
        this.changeUserPasswordInteractor.execute(authorization, request)

        then:
        1 * this.managementUserSecurityService.getUserEmail(authorization) >> userEmail
        1 * this.userRepository.findByEmail(userEmail) >> Optional.of(user)
        1 * this.managementUserSecurityService.changePassword(user.email, request.oldPassword, request.newPassword)

        notThrown()
    }
}
