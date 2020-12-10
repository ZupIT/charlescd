package io.charlescd.moove.application.module

import io.charlescd.moove.application.ModuleService
import io.charlescd.moove.domain.Component
import io.charlescd.moove.domain.Module
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.ModuleRepository
import spock.lang.Specification
import java.time.LocalDateTime

class ModuleServiceTest extends Specification {

    private ModuleService moduleService
    private ModuleRepository moduleRepository = Mock(ModuleRepository)

    void setup() {
        this.moduleService = new ModuleService(moduleRepository)
    }

    void "when save a module should be not throw"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.create(module)

        then:
        1 * this.moduleRepository.save(module)
        notThrown()
    }

    void "when update a module should be not throw"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.update(module)

        then:
        1 * this.moduleRepository.update(module)
        notThrown()
    }

    void "when delete a module should be not throw"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.delete(module)

        then:
        1 * this.moduleRepository.delete(module.id, module.workspaceId)
        notThrown()
    }

    void "when add componet to module should be not throw"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.addComponents(module)

        then:
        1 * this.moduleRepository.addComponents(module)
        notThrown()
    }

    void "when update component to module should be not throw"() {
        given:
        def component = new Component("id", "1", "module", LocalDateTime.now(), "workspaceId", 10, 10, "hostValue", "gateway")
        when:
        this.moduleService.updateComponent(component)

        then:
        1 * this.moduleRepository.updateComponent(component)
        notThrown()
    }


    void "when find a module by id should return them"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.find("1")

        then:
        1 * this.moduleRepository.find("1") >> Optional.of(module)
        notThrown()
    }

    void "when find a module by id and not exist should throw NotFoundException"() {
        given:

        when:
        this.moduleService.find("1")

        then:
        1 * this.moduleRepository.find("1") >> Optional.empty()
        thrown(NotFoundException)
    }

    void "when find a module by id and workspace should return them"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        when:
        this.moduleService.find("1", "workspaceId")

        then:
        1 * this.moduleRepository.find("1", "workspaceId") >> Optional.of(module)
        notThrown()
    }

    void "when find a module by id and workspace, and not exist should throw NotFoundException"() {
        given:

        when:
        this.moduleService.find("1", "workspace")

        then:
        1 * this.moduleRepository.find("1", "workspace") >> Optional.empty()
        thrown(NotFoundException)
    }

    void "when find more one module by ids should return them"() {
        given:
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def module = new Module("1", "Module Name", "http://github.com", LocalDateTime.now(), "helm", author, [], null, [], "workspaceId")

        def ids = new ArrayList();
        ids.add("1")

        def result = new ArrayList()
        result.add(module)

        when:
        this.moduleService.findByIdsAndWorkspaceId(ids, "workspace")

        then:
        1 * this.moduleRepository.findByIdsAndWorkpaceId(ids, "workspace") >> result
        noExceptionThrown()
    }
}
