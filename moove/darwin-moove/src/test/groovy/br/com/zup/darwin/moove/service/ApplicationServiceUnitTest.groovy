/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

package br.com.zup.darwin.moove.service

import br.com.zup.darwin.commons.request.member.AddMemberRequest
import br.com.zup.darwin.entity.Application
import br.com.zup.darwin.entity.Problem
import br.com.zup.darwin.entity.User
import br.com.zup.darwin.moove.request.application.CreateApplicationRequest
import br.com.zup.darwin.moove.request.application.UpdateApplicationRequest
import br.com.zup.darwin.repository.ApplicationRepository
import br.com.zup.darwin.repository.ProblemRepository
import br.com.zup.darwin.repository.UserRepository
import br.com.zup.exception.handler.exception.NotFoundException
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import spock.lang.Specification

import java.time.LocalDateTime

class ApplicationServiceUnitTest extends Specification {

    private ApplicationService applicationService

    private ApplicationRepository applicationRepository = Mock(ApplicationRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private KeycloakService keycloakService = Mock(KeycloakService)
    private ProblemRepository problemRepository = Mock(ProblemRepository)

    User user = new User(UUID.randomUUID().toString(), "Jon Snow", "email", "http://test.com/bastard.png", [], LocalDateTime.now())

    Application application = new Application(
            UUID.randomUUID().toString(),
            "application",
            [],
            user
    )

    Problem problem = new Problem(
            UUID.randomUUID().toString(),
            "Quick board",
            LocalDateTime.now(),
            user,
            "Quick board",
            [],
            "application-id"
    )

    CreateApplicationRequest request = new CreateApplicationRequest(
            "application",
            "userId"
    )

    def setup() {
        applicationService = new ApplicationService(applicationRepository, userRepository, keycloakService, problemRepository)
    }

    def "should return all applications on findAll"() {

        given:
        def pageable = PageRequest.of(0, 1)

        when:
        def page = applicationService.findAll(pageable)

        then:
        1 * applicationRepository.findAll(pageable) >> new PageImpl<>([application], pageable, 1)
        page != null
        page.content != null
        page.content.size() == 1
        page.page == 0
        page.last
        page.totalPages == 1

    }

    def "should not return applications on findAll"() {

        given:
        def pageable = PageRequest.of(0, 1)

        when:
        def page = applicationService.findAll(pageable)

        then:
        1 * applicationRepository.findAll(pageable) >> new PageImpl<>([], pageable, 1)
        page != null
        page.content != null
        page.content.size() == 0
        page.page == 0
        page.last
        page.totalPages == 1

    }

    def "should return application on findById"() {

        when:
        def representation = applicationService.findById(application.id)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.of(application)
        representation.id == application.id
        representation.name == application.name
        representation.users.size() == application.users.size()
        representation.membersCount == application.users.size()

    }

    def "should not return application on findById"() {

        when:
        applicationService.findById(application.id)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.empty()
        thrown(NotFoundException)

    }

    def "should create a application"() {

        when:
        def representation = applicationService.create(request)

        then:
        1 * userRepository.findById(_) >> Optional.of(user)
        1 * applicationRepository.save(_) >> application
        1 * problemRepository.save(_) >> problem
        representation.id == application.id
        representation.name == application.name
        representation.users.size() == application.users.size()
        representation.membersCount == application.users.size()

    }

    def "should not create a application when a user does not exists"() {

        when:
        applicationService.create(request)

        then:
        1 * userRepository.findById(_) >> Optional.empty()
        thrown(NotFoundException)

    }

    def "should update an application by id"() {

        given:
        UpdateApplicationRequest request = new UpdateApplicationRequest("application-2")

        when:
        def representation = applicationService.update(application.id, request)

        then:
        1 * applicationRepository.findById(_) >> Optional.of(application)
        1 * applicationRepository.save(_) >> new Application(
                application.id,
                request.name,
                [],
                user
        )
        representation.id == application.id
        representation.name == request.name

    }

    def "should not update an application when application does not exists"() {

        given:
        UpdateApplicationRequest request = new UpdateApplicationRequest("application-2")

        when:
        applicationService.update(application.id, request)

        then:
        1 * applicationRepository.findById(_) >> Optional.empty()
        thrown(NotFoundException)

    }

    def "should delete an application"() {

        when:
        applicationService.delete(application.id)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.of(application)
        notThrown(NotFoundException)

    }

    def "should not delete an application when application does not exists"() {

        when:
        applicationService.delete(application.id)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.empty()
        thrown(NotFoundException)

    }

    def "should add member to application"() {

        given:
        User user1 = new User("user1-id", "Jon Snow", "email1", "http://test.com/bastard.png", [application], LocalDateTime.now())
        User user2 = new User("user2-id", "Jon Snow", "email2", "http://test.com/bastard.png", [application], LocalDateTime.now())
        Application applicationWithUsers = application.copy(application.id, application.name, [user1, user2], user)
        AddMemberRequest request = new AddMemberRequest(user.id, [user1.id, user2.id])

        when:
        applicationService.addMembers(application.id, request)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.of(application)
        1 * applicationRepository.saveAndFlush(_) >> applicationWithUsers
        2 * userRepository.findById(user1.id) >> Optional.of(user1)
        2 * userRepository.findById(user2.id) >> Optional.of(user2)
        1 * keycloakService.updateUserAttributes(user1.email, [application.id])
        1 * keycloakService.updateUserAttributes(user2.email, [application.id])

    }

    def "should not add member to application when application does not exists"() {

        given:
        User user1 = new User("user1-id", "Jon Snow", "email1", "http://test.com/bastard.png", [application], LocalDateTime.now())
        User user2 = new User("user2-id", "Jon Snow", "email2", "http://test.com/bastard.png", [application], LocalDateTime.now())
        AddMemberRequest request = new AddMemberRequest(user.id, [user1.id, user2.id])

        when:
        applicationService.addMembers(application.id, request)

        then:
        1 * applicationRepository.findById(application.id) >> Optional.empty()
        thrown(NotFoundException)

    }

    def "should add member to application and remove application from another user"() {

        given:
        Application application1 = new Application("application1-id", "application1", [user], user)
        User user1 = new User("user1-id", "Jon Snow", "email1", "http://test.com/bastard.png", [application], LocalDateTime.now())
        User user2 = new User("user2-id", "Jon Snow", "email2", "http://test.com/bastard.png", [application], LocalDateTime.now())
        Application applicationWithUsers = application1.copy(application.id, application.name, [user1, user2], user)
        AddMemberRequest request = new AddMemberRequest(user.id, [user1.id, user2.id])

        when:
        applicationService.addMembers(application1.id, request)

        then:
        1 * applicationRepository.findById(application1.id) >> Optional.of(application1)
        1 * userRepository.findById(user.id) >> Optional.of(user)
        1 * keycloakService.updateUserAttributes(user.email, [])
        1 * applicationRepository.saveAndFlush(_) >> applicationWithUsers
        2 * userRepository.findById(user1.id) >> Optional.of(user1)
        2 * userRepository.findById(user2.id) >> Optional.of(user2)
        1 * keycloakService.updateUserAttributes(user1.email, [application.id])
        1 * keycloakService.updateUserAttributes(user2.email, [application.id])

    }

}
