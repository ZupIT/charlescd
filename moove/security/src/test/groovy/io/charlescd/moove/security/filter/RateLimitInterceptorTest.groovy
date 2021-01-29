package io.charlescd.moove.security.filter


import io.charlescd.moove.security.service.RateLimitService
import io.github.bucket4j.Bucket
import io.github.bucket4j.ConsumptionProbe
import org.keycloak.common.VerificationException
import org.springframework.http.HttpMethod
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import spock.lang.Specification

class RateLimitInterceptorTest extends Specification {

    private RateLimitInterceptor rateLimitInterceptor
    private RateLimitService rateLimitService = Mock(RateLimitService)
    private Bucket tokenBucket = Mock(Bucket)
    private ConsumptionProbe probe = Mock(ConsumptionProbe)

    def setup() {
        rateLimitInterceptor = new RateLimitInterceptor(rateLimitService)
    }

    def "should execute the request"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.POST.name())

        def response = new MockHttpServletResponse()

        when:
        def res = rateLimitInterceptor.preHandle(request, response, _)

        then:
        1 * rateLimitService.resolveBucket(dummyToken()) >> tokenBucket
        1 * tokenBucket.tryConsumeAndReturnRemaining(1) >> probe
        1 * probe.isConsumed() >> true

        notThrown()
        assert res
    }

    def "should execute the request without authorization cause its an open path"() {
        given:
        def request = new MockHttpServletRequest()
        request.setRequestURI("/api/ellipse/123456789")
        request.setMethod(HttpMethod.POST.name())

        def response = new MockHttpServletResponse()

        when:
        def res = rateLimitInterceptor.preHandle(request, response, _)

        then:
        0 * rateLimitService.resolveBucket(any())
        0 * tokenBucket.tryConsumeAndReturnRemaining(1)
        0 * probe.isConsumed()

        notThrown()
        assert res
    }

    def "should not execute the request because the limit was exceeded"() {
        given:
        def request = new MockHttpServletRequest()
        request.addHeader("Authorization", dummyToken())
        request.addHeader("x-workspace-id", "b659094f-999c-4d24-90b3-26c5e173b7ec")
        request.setRequestURI("/api/circle/123456789")
        request.setMethod(HttpMethod.POST.name())

        def response = new MockHttpServletResponse()

        when:
        def res = rateLimitInterceptor.preHandle(request, response, _)

        then:
        1 * rateLimitService.resolveBucket(dummyToken()) >> tokenBucket
        1 * tokenBucket.tryConsumeAndReturnRemaining(1) >> probe
        1 * probe.isConsumed() >> false

        notThrown()
        assert !res
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
