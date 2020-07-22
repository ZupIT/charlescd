package io.charlescd.moove.infrastructure.service

import io.charlescd.moove.infrastructure.service.client.KeycloakCustomClient
import spock.lang.Specification

class KeycloakCustomClientServiceTest extends Specification {

    private KeycloakCustomClientService keycloakCustomClientService
    private KeycloakCustomClient keycloakCustomClient = Mock(KeycloakCustomClient)

    void setup() {
        keycloakCustomClientService = new KeycloakCustomClientService(keycloakCustomClient)
        keycloakCustomClientService.realm = "charlesCd"
    }

    def "should hit user info endpoint without an error "() {
        given:
        def authorization = "Beaer ewogICJleHAiOiAxNTk0OTMwNTcxLAogICJpYXQiOiAxNTk0OTI2OTcxLAogICJqdGkiOiAiZmJiMzY1Y2EtZDNlMC00MTQzLTg1ZjItYWY5MGMyMDA0Y2Y3I" +
                "iwKICAiaXNzIjogImh0dHBzOi8vZHVtbXlhZGRyZXNzIiwKICAiYXVkIjogImRhcndpbi1jbGllbnQiLAogICJzdWIiOiAiN2NlY2I0MjQtNTM5My00MWNjLWEzZmEtMDdlNWVlNDI5M" +
                "DhhIiwKICAidHlwIjogIkJlYXJlciIsCiAgImF6cCI6ICJkdW1teS1jbGllbnQiLAogICJzZXNzaW9uX3N0YXRlIjogIjRjOGJjOTJlLTZjZTAtNDI4Mi1iZjU0LTJiNTRiMjQ0ZTdkZ" +
                "iIsCiAgImFjciI6ICIxIiwKICAiYWxsb3dlZC1vcmlnaW5zIjogWwogICAgIioiCiAgXSwKICAic2NvcGUiOiAicHJvZmlsZSBlbWFpbCIsCiAgImVtYWlsX3ZlcmlmaWVkIjogdHJ1Z" +
                "SwKICAiaXNSb290IjogdHJ1ZSwKICAicHJlZmVycmVkX3VzZXJuYW1lIjogImR1bW15QGR1bW15LmNvbSIsCiAgImVtYWlsIjogImR1bW15QGR1bW15LmNvbSIKfQ=="

        when:
        keycloakCustomClientService.hitUserInfo(authorization)

        then:
        1 * keycloakCustomClient.userInfo("charlesCd", authorization)
    }
}
