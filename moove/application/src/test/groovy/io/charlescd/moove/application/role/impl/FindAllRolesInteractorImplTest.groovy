package io.charlescd.moove.application.role.impl

import io.charlescd.moove.application.RoleService
import io.charlescd.moove.domain.Page
import io.charlescd.moove.domain.PageRequest
import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.Role
import io.charlescd.moove.domain.repository.RoleRepository
import spock.lang.Specification

import java.time.LocalDateTime

class FindAllRolesInteractorImplTest extends Specification {

    private FindAllRolesInteractorImpl findAllRolesInteractor
    private RoleRepository roleRepository = Mock(RoleRepository)
    private RoleService roleService = new RoleService(roleRepository)

    void setup() {
        this.findAllRolesInteractor = new FindAllRolesInteractorImpl(roleService)
    }

    def "when search all roles should return paginated roles"() {
        given:
        def permission = new Permission("1", "Permission 1", LocalDateTime.now())
        def role = new Role("1", "Role Name", "Desc", [permission], LocalDateTime.now())
        def roles = [role]
        def pageRole = new Page<Role>(roles, 0, 10, 1)
        def pageRequest = new PageRequest()

        when:
        def response = this.findAllRolesInteractor.execute(pageRequest)

        then:
        1 * this.roleRepository.find(pageRequest) >> pageRole

        response.content.size() == 1
        response.content.first().id == "1"
        response.content.first().description == "Desc"
        response.content.first().name == "Role Name"
        response.content.first().permissions.first().id == "1"

    }
}
