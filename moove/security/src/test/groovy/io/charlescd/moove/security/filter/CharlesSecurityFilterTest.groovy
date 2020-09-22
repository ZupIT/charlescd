package io.charlescd.moove.security.filter

import io.charlescd.moove.domain.service.KeycloakCustomService
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockFilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import spock.lang.Specification

class CharlesSecurityFilterTest extends Specification {

    private CharlesSecurityFilter charlesSecurityFilter
    private KeycloakCustomService keycloakCustomService = Mock(KeycloakCustomService)

    def setup() {
        charlesSecurityFilter = new CharlesSecurityFilter(keycloakCustomService)
    }

    def "should allow root post requests"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyTokenRoot())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.POST.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * keycloakCustomService.hitUserInfo(dummyTokenRoot())
        notThrown()
    }

    def "should allow root get requests"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyTokenRoot())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * keycloakCustomService.hitUserInfo(dummyTokenRoot())
        notThrown()
    }

    def "should allow user management to post with authorization"(){
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyUserToken())
        request.setRequestURI("/api/user")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        1 * keycloakCustomService.hitUserInfo(dummyUserToken())
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

    def "should return 403 HTTP code"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyTokenMaintenanceAndModules())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.GET.name())

        def response = new MockHttpServletResponse()
        def filterChain = new MockFilterChain()

        when:
        charlesSecurityFilter.doFilter(request, response, filterChain)

        then:
        assert response.status == HttpStatus.FORBIDDEN.value()
    }

    def dummyTokenRoot() {
        return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMzc4YmVjZS1lYzU4LTQ2MTAtODc2Ny0zYWJhZDE5NjY4OGQiLCJleHAiOj" +
                "E1ODgxOTI0MzEsIm5iZiI6MCwiaWF0IjoxNTgxMzU1MzE1LCJpc3MiOiJodHRwczovL2Rhcndpbi1rZXljbG9hay5jb250aW51b" +
                "3VzcGxhdGZvcm0uY29tL2F1dGgvcmVhbG1zL2RhcndpbiIsImF1ZCI6WyJkYXJ3aW4tY2xpZW50IiwiYWNjb3VudCJdLCJzdWIi" +
                "OiI5YjFiNGRhOS0wMWRhLTQ4OTctYTVhYi04MWQzMzZiZjQ5ZmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJkYXJ3aW4tY2xpZW5" +
                "0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYTNkOTU1MWYtZDM2OS00ODRlLTgxNTMtOGNiMGI3ZGE2MDI1IiwiYW" +
                "NyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJtb292ZV9yZWFkIiwiY29uZ" +
                "mlnX3dyaXRlIiwiYWRtaW4iLCJjaXJjbGVfcmVhZCIsImNpcmNsZV93cml0ZSIsIm1vZHVsZV9yZWFkIiwiYnVpbGRfcmVhZCIs" +
                "ImRlcGxveV9yZWFkIiwiZGVwbG95X3dyaXRlIiwiYnVpbGRfd3JpdGUiLCJvZmZsaW5lX2FjY2VzcyIsImNvbmZpZ19yZWFkIiw" +
                "ibW9kdWxlX3dyaXRlIiwidW1hX2F1dGhvcml6YXRpb24iLCJtb292ZV93cml0ZSJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY2" +
                "91bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sI" +
                "mlzUm9vdCI6dHJ1ZSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiQWRhdXRv" +
                "IEFmb25zbyBkZSBQYXVsYSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkYXV0by5wYXVsYUB6dXAuY29tLmJyIiwiZ2l2ZW5fbmF" +
                "tZSI6IkFkYXV0byIsImZhbWlseV9uYW1lIjoiQWZvbnNvIGRlIFBhdWxhIiwiZW1haWwiOiJhZGF1dG8ucGF1bGFAenVwLmNvbS" +
                "5iciJ9.y2KK5XLvOHkMbJCDkDcdY1495oCHcSmcKNIDjKR5edY"
    }

    def dummyUserToken() {
        return "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwMzc4YmVjZS1lYzU4LTQ2MTAtODc2Ny0zYWJhZDE5NjY4" +
                "OGQiLCJleHAiOjE1ODgxOTI0MzEsIm5iZiI6MCwiaWF0IjoxNTgxMzU1MzE1LCJpc3MiOiJodHRwczovL2Rhcndpbi1rZXljbG9" +
                "hay5jb250aW51b3VzcGxhdGZvcm0uY29tL2F1dGgvcmVhbG1zL2RhcndpbiIsImF1ZCI6WyJkYXJ3aW4tY2xpZW50IiwiYWNjb3" +
                "VudCJdLCJzdWIiOiI5YjFiNGRhOS0wMWRhLTQ4OTctYTVhYi04MWQzMzZiZjQ5ZmIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJkY" +
                "XJ3aW4tY2xpZW50IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYTNkOTU1MWYtZDM2OS00ODRlLTgxNTMtOGNiMGI3" +
                "ZGE2MDI1IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3Z" +
                "lcmlmaWVkIjpmYWxzZSwibmFtZSI6IkFkYXV0byBBZm9uc28gZGUgUGF1bGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZGF1dG" +
                "8ucGF1bGFAenVwLmNvbS5iciIsImdpdmVuX25hbWUiOiJBZGF1dG8iLCJmYW1pbHlfbmFtZSI6IkFmb25zbyBkZSBQYXVsYSIsI" +
                "mVtYWlsIjoiYWRhdXRvLnBhdWxhQHp1cC5jb20uYnIifQ.ZO0l9_RSrk_FX6HByCo_ob8uVVVf-cybjhN4_a4lSWs"
    }

    def dummyTokenModulesRead() {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3Jrc3BhY2VzIjpbeyJpZCI6IndvcmtzcGFjZS1pZCIsInBlcm1pc3Npb25zIjpbIm" +
                "1vZHVsZXNfcmVhZCJdfV0sImlzUm9vdCI6ZmFsc2UsImp0aSI6IjAzNzhiZWNlLWVjNTgtNDYxMC04NzY3LTNhYmFkMTk2Njg4Z" +
                "CIsImV4cCI6MTU4MTM1ODkxNSwibmJmIjowLCJpYXQiOjE1ODEzNTUzMTUsImlzcyI6Imh0dHBzOi8vZGFyd2luLWtleWNsb2Fr" +
                "LmNvbnRpbnVvdXNwbGF0Zm9ybS5jb20vYXV0aC9yZWFsbXMvZGFyd2luIiwiYXVkIjpbImRhcndpbi1jbGllbnQiLCJhY2NvdW5" +
                "0Il0sInN1YiI6IjliMWI0ZGE5LTAxZGEtNDg5Ny1hNWFiLTgxZDMzNmJmNDlmYiIsInR5cCI6IkJlYXJlciIsImF6cCI6ImRhcn" +
                "dpbi1jbGllbnQiLCJhdXRoX3RpbWUiOjAsInNlc3Npb25fc3RhdGUiOiJhM2Q5NTUxZi1kMzY5LTQ4NGUtODE1My04Y2IwYjdkY" +
                "TYwMjUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm1vb3ZlX3Jl" +
                "YWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY29" +
                "1bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2" +
                "UsIm5hbWUiOiJBZGF1dG8gQWZvbnNvIGRlIFBhdWxhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRhdXRvLnBhdWxhQHp1cC5jb" +
                "20uYnIiLCJnaXZlbl9uYW1lIjoiQWRhdXRvIiwiZmFtaWx5X25hbWUiOiJBZm9uc28gZGUgUGF1bGEiLCJlbWFpbCI6ImFkYXV0" +
                "by5wYXVsYUB6dXAuY29tLmJyIn0.ao9M53qYvT_peQ1191ecVql1F0-oCgGBmHntZX2GFAU"
    }

    def dummyTokenMaintenanceAndModules() {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3Jrc3BhY2VzIjpbeyJpZCI6IndvcmtzcGFjZS1pZCIsInBlcm1pc3Npb25zIjpbIm" +
                "1vZHVsZXNfcmVhZCIsIm1haW50ZW5hbmNlX3dyaXRlIl19XSwiaXNSb290IjpmYWxzZSwianRpIjoiMDM3OGJlY2UtZWM1OC00N" +
                "jEwLTg3NjctM2FiYWQxOTY2ODhkIiwiZXhwIjoxNTgxMzU4OTE1LCJuYmYiOjAsImlhdCI6MTU4MTM1NTMxNSwiaXNzIjoiaHR0" +
                "cHM6Ly9kYXJ3aW4ta2V5Y2xvYWsuY29udGludW91c3BsYXRmb3JtLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQiOlsiZGF" +
                "yd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiOWIxYjRkYTktMDFkYS00ODk3LWE1YWItODFkMzM2YmY0OWZiIiwidHlwIj" +
                "oiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImEzZDk1NTFmLWQzN" +
                "jktNDg0ZS04MTUzLThjYjBiN2RhNjAyNSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3Mi" +
                "Onsicm9sZXMiOlsibW9vdmVfcmVhZCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWF" +
                "jY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsIm" +
                "VtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkFkYXV0byBBZm9uc28gZGUgUGF1bGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiO" +
                "iJhZGF1dG8ucGF1bGFAenVwLmNvbS5iciIsImdpdmVuX25hbWUiOiJBZGF1dG8iLCJmYW1pbHlfbmFtZSI6IkFmb25zbyBkZSBQ" +
                "YXVsYSIsImVtYWlsIjoiYWRhdXRvLnBhdWxhQHp1cC5jb20uYnIifQ.r_9nadOCYu-nj6r_NDEhySUOvE6owvUeUFoK2Xsaz-k"
    }
}
