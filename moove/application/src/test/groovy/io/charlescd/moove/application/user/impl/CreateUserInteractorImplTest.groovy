package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.CreateUserInteractor
import io.charlescd.moove.application.user.request.CreateUserRequest
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.service.KeycloakService
import spock.lang.Specification

class CreateUserInteractorImplTest extends Specification {

    private CreateUserInteractor createUserInteractor
    private UserRepository userRepository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)

    def setup() {
        createUserInteractor = new CreateUserInteractorImpl(new UserService(userRepository), keycloakService)
    }

    def "when trying to create user should do it successfully"() {
        given:
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "email@test.com.br", "https://www.photos.com/johndoe", false)

        when:
        def userResponse = createUserInteractor.execute(createUserRequest)

        then:
        1 * userRepository.findByEmail(createUserRequest.email) >> Optional.empty()
        1 * userRepository.save(_) >> _
        1 * keycloakService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password, false)

        userResponse.name == createUserRequest.name
        userResponse.photoUrl == createUserRequest.photoUrl
        notThrown()
    }

    def "when trying to create a user should trim and lowercase the email"() {
        given:
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "  email@TEst.com.br      ", "https://www.photos.com/johndoe", false)

        when:
        def userResponse = createUserInteractor.execute(createUserRequest)

        then:
        1 * userRepository.findByEmail(createUserRequest.email.toLowerCase().trim()) >> Optional.empty()
        1 * userRepository.save(_) >> _
        1 * keycloakService.createUser(createUserRequest.email.toLowerCase().trim(), createUserRequest.name, createUserRequest.password, false)

        userResponse.name == createUserRequest.name
        userResponse.photoUrl == createUserRequest.photoUrl
        userResponse.email == createUserRequest.email.toLowerCase().trim()
        notThrown()
    }

    def "when trying to create user, if email already exists should throw exception"(){
        given:
        def createUserRequest = new CreateUserRequest("John Doe", "123fakepassword", "email@test.com.br", "https://www.photos.com/johndoe", false)
        def user = createUserRequest.toUser()

        when:
        createUserInteractor.execute(createUserRequest)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        0 * userRepository.save(_) >> user
        0 * keycloakService.createUser(createUserRequest.email, createUserRequest.name, createUserRequest.password, false)

        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.CREATE_USER_ERROR_EMAIL_ALREADY_EXISTS
    }

}
