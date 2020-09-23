package io.charlescd.moove.security.filter

import io.charlescd.moove.domain.Permission
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.WorkspacePermissions
import io.charlescd.moove.domain.WorkspaceStatusEnum
import io.charlescd.moove.domain.repository.UserRepository
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockFilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import spock.lang.Specification

import java.time.LocalDateTime

class CharlesSecurityFilterTest extends Specification {

    private CharlesSecurityFilter charlesSecurityFilter
    private UserRepository userRepository = Mock(UserRepository)

    def setup() {
        charlesSecurityFilter = new CharlesSecurityFilter(userRepository)
    }

    def "should allow root post requests"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.POST.name())

        def user = new User("user-id", "User", "user@zup.com.br", "", [], true, LocalDateTime.now())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        notThrown()
    }

    def "should allow root get requests"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def user = new User("user-id", "User", "user@zup.com.br", "", [], true, LocalDateTime.now())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        notThrown()
    }

    def "should allow user management to post with authorization"(){
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.setRequestURI("/api/user")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        notThrown()
    }

    def "should not allow user management to post without authorization"(){
        given:
        def request = new MockHttpServletRequest()
        request.setRequestURI("/api/user")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        assert response.status == HttpStatus.UNAUTHORIZED.value()
    }

    def "should not allow requests without an access token"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        assert response.status == HttpStatus.UNAUTHORIZED.value()
    }

    def "should deny requests on wrong workspace"() {
        given:
        def workspaceId = "b659094f-999c-4d24-90b3-26c5e173b7ec"

        def author = new User("user-id", "User", "user@zup.com.br", "", [], true, LocalDateTime.now())
        def permission = new Permission("permission-id", "maintenance_write", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions(workspaceId, "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        def user = new User("user-id", "User", "user@zup.com.br", "", [workspacePermission], false, LocalDateTime.now())

        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", "wrong-workspace-id")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        assert response.status == HttpStatus.FORBIDDEN.value()
    }

    def "should allow requests with right permission on that workspace"() {
        given:
        def workspaceId = "b659094f-999c-4d24-90b3-26c5e173b7ec"

        def author = new User("user-id", "User", "user@zup.com.br", "", [], true, LocalDateTime.now())
        def permission = new Permission("permission-id", "circles_read", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions(workspaceId, "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        def user = new User("user-id", "User", "user@zup.com.br", "", [workspacePermission], false, LocalDateTime.now())

        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", workspaceId)
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        notThrown()
    }

    def "should deny requests with wrong permission on that workspace"() {
        given:
        def workspaceId = "b659094f-999c-4d24-90b3-26c5e173b7ec"

        def author = new User("user-id", "User", "user@zup.com.br", "", [], true, LocalDateTime.now())
        def permission = new Permission("permission-id", "maintenance_write", LocalDateTime.now())
        def workspacePermission = new WorkspacePermissions(workspaceId, "workspace-name", [permission], author, LocalDateTime.now(), WorkspaceStatusEnum.COMPLETE)
        def user = new User("user-id", "User", "user@zup.com.br", "", [workspacePermission], false, LocalDateTime.now())

        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", workspaceId)
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * userRepository.findByEmail(user.email) >> Optional.of(user)
        assert response.status == HttpStatus.FORBIDDEN.value()
    }

    def dummyToken() {
        return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMzc4YmVjZS1lYzU4LTQ2MTAtODc2Ny0zYWJhZDE5NjY4" +
                "OGQiLCJleHAiOjE1ODgxOTI0MzEsIm5iZiI6MCwiaWF0IjoxNTgxMzU1MzE1LCJpc3MiOiJodHRwczovL2Rhcndpbi1rZXljbG9" +
                "hay5jb250aW51b3VzcGxhdGZvcm0uY29tL2F1dGgvcmVhbG1zL2RhcndpbiIsImF1ZCI6WyJkYXJ3aW4tY2xpZW50IiwiYWNjb3" +
                "VudCJdLCJzdWIiOiI5YjFiNGRhOS0wMWRhLTQ4OTctYTVhYi04MWQzMzZiZjQ5ZmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJkY" +
                "XJ3aW4tY2xpZW50IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYTNkOTU1MWYtZDM2OS00ODRlLTgxNTMtOGNiMGI3" +
                "ZGE2MDI1IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJ" +
                "vbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6In" +
                "Byb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJVc2VyIE5hbWUiLCJwcmVmZXJyZWRfdXNlcm5hb" +
                "WUiOiJ1c2VyQHp1cC5jb20uYnIiLCJnaXZlbl9uYW1lIjoiVXNlciIsImZhbWlseV9uYW1lIjoiVXNlciBOYW1lIiwiZW1haWwi" +
                "OiJ1c2VyQHp1cC5jb20uYnIifQ.0jfbAT1gR0XCE4U1UcwDZnx862Tbhv7xl1r7SBY8If0"
    }

}
