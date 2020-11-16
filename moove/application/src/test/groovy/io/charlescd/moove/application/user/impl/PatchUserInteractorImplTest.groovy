package io.charlescd.moove.application.user.impl

import io.charlescd.moove.application.OpCodeEnum
import io.charlescd.moove.application.PatchOperation
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.user.PatchUserInteractor
import io.charlescd.moove.application.user.request.PatchUserRequest
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.repository.UserRepository
import spock.lang.Specification

import java.time.LocalDateTime

class PatchUserInteractorImplTest extends Specification {

    private PatchUserInteractor patchUserInteractor
    private UserRepository userRepository = Mock(UserRepository)

    def setup() {
        patchUserInteractor = new PatchUserInteractorImpl(new UserService(userRepository), true)
    }

    def "when trying to update user name should do it successfully"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/name", "Patched")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        def userResponse = patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        1 * this.userRepository.update(_) >> { arguments ->
            def patchedUser = arguments[0]

            assert patchedUser instanceof User

            return patchedUser
        }

        assert userResponse.id == user.id
        assert userResponse.name == "Patched"
        assert userResponse.email == user.email
        assert userResponse.photoUrl == user.photoUrl
        assert userResponse.root == user.root
        notThrown()
    }

    def "when trying to update user name with non root user should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), false)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/name", null)]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(BusinessException)
        exception.message == "forbidden"
    }

    def "when trying to update user name with null value should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/name", null)]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(IllegalArgumentException)
        exception.message == "Name cannot be null."
    }

    def "when trying to update user name with empty value should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/name", "")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(IllegalArgumentException)
        exception.message == "Name minimum size is 1 and maximum is 64."
    }

    def "when trying to update user name with exceeded size value should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/name", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(IllegalArgumentException)
        exception.message == "Name minimum size is 1 and maximum is 64."
    }

    def "when trying to remove user name should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REMOVE, "/name", "Patched")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(IllegalArgumentException)
        exception.message == "Remove operation not allowed."
    }

    def "when trying to update user avatar should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/avatar", "Patched")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        1 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(IllegalArgumentException)
        exception.message == "Path /avatar is not allowed."
    }

    def "when trying to update user using external IDM should thrown exception"() {
        given:
        def userId = UUID.randomUUID()

        def user = getDummyUser(userId.toString(), true)

        def patches = [new PatchOperation(OpCodeEnum.REPLACE, "/avatar", "Patched")]
        def request = new PatchUserRequest(patches)
        def authorization = "Bearer token"

        patchUserInteractor = new PatchUserInteractorImpl(new UserService(userRepository), false)

        when:
        patchUserInteractor.execute(userId, request, authorization)

        then:
        0 * this.userRepository.findById(userId.toString()) >> Optional.of(user)
        0 * this.userRepository.update(_) >> any()

        def exception = thrown(BusinessException)
        exception.errorCode == MooveErrorCode.EXTERNAL_IDM_FORBIDDEN
    }

    private static User getDummyUser(String id, Boolean root) {
        new User(id, "charles", "email@mail", "http://charles.com/dummy_photo.jpg", [], root, LocalDateTime.now())
    }
}
