package io.charlescd.moove.application.hypothesis

import io.charlescd.moove.application.HypothesisService
import io.charlescd.moove.domain.Hypothesis
import io.charlescd.moove.domain.User
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.HypothesisRepository
import spock.lang.Specification

import java.time.LocalDateTime

class HypothesisServiceTest extends Specification {

    private HypothesisService hypothesisService
    private HypothesisRepository hypothesisRepository = Mock(HypothesisRepository)

    void setup() {
        this.hypothesisService = new HypothesisService(hypothesisRepository)
    }

    void "when request find hypothesis should be return hypothesis founded"() {
        given:
        def id = "1"
        def workspaceId = UUID.randomUUID().toString()
        def author = new User("1", "User authpr", "author@teste.com", "http://google.com", [], true, LocalDateTime.now())
        def hypothesis = new Hypothesis("1", "Hyp Name", "Desc", author, LocalDateTime.now(), [], [], workspaceId)

        when:
        final def response = this.hypothesisService.find(id, workspaceId)

        then:
        1 * this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId) >> Optional.of(hypothesis)
        notThrown()
        response.id == id
        response.workspaceId == workspaceId
        response.author.id == "1"
        response.description == "Desc"
    }

    void "when request find hypothesis and hypothesis not exists should be throw exception"() {
        given:
        def id = "1"
        def workspaceId = UUID.randomUUID().toString()

        when:
        this.hypothesisService.find(id, workspaceId)

        then:
        1 * this.hypothesisRepository.findByIdAndWorkspaceId(id, workspaceId) >> Optional.empty()
        def ex = thrown(NotFoundException)
        ex.resourceName == "hypothesis"
        ex.id == id
    }
}
