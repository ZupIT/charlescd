package io.charlescd.moove.application.components.impl

import io.charlescd.moove.application.components.FindDeployedComponentsByCircleInteractor
import io.charlescd.moove.domain.SimpleComponent
import io.charlescd.moove.domain.repository.ComponentRepository
import spock.lang.Specification

class FindDeployedComponentsByCircleInteractorImplTest extends Specification {

    private FindDeployedComponentsByCircleInteractor findDeployedComponentsByCircleInteractor

    private ComponentRepository componentRepository = Mock(ComponentRepository)

    void setup() {
        findDeployedComponentsByCircleInteractor = new FindDeployedComponentsByCircleInteractorImpl(componentRepository)
    }

    def "should find deployed components by circle"() {
        given:
        def workspaceId = "5f39caad-5b3c-404c-b035-1089ca10c68d"
        def circleId = "4ea37c3c-9fe3-4b81-8950-58d2dccbf6da"

        def List<SimpleComponent> simpleComponents = new ArrayList<SimpleComponent>();
        simpleComponents.add new SimpleComponent("id", "moduleId", "name", "workspaceId", 0, 0, "moduleName")

        when:
        def response = findDeployedComponentsByCircleInteractor.execute(workspaceId, circleId)

        then:
        1 * componentRepository.findAllDeployedAtCircle(circleId, workspaceId) >> simpleComponents

        assert response != null
        assert response.size() == 1
        assert response[0].name == "name"
        assert response[0].id == "id"
        assert response[0].errorThreshold == 0
    }
}
