package io.charlescd.moove.security.service

import io.github.bucket4j.Bucket
import spock.lang.Specification

class RateLimitServiceTest extends Specification {
    private Bucket bucket = Mock(Bucket)

    def "should execute resolveBucket"() {
       given:
       def token = dummyToken()
       RateLimitService spy = Spy(RateLimitService, constructorArgs: [])
        when:
        def res = spy.resolveBucket(token)

        then:
        1 * spy.newBucket() >> bucket

        notThrown()
        assert res.getAvailableTokens() == 0
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
