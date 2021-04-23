package io.charlescd.moove.application.configuration.impl

import feign.FeignException
import io.charlescd.moove.application.TestUtils
import io.charlescd.moove.application.UserService
import io.charlescd.moove.application.WorkspaceService
import io.charlescd.moove.application.configuration.CreateDeploymentConfigurationInteractor
import io.charlescd.moove.application.configuration.request.CreateDeploymentConfigurationRequest
import io.charlescd.moove.domain.DeploymentConfiguration
import io.charlescd.moove.domain.GitConfiguration
import io.charlescd.moove.domain.GitProviderEnum
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.repository.DeploymentConfigurationRepository
import io.charlescd.moove.domain.repository.UserRepository
import io.charlescd.moove.domain.repository.WorkspaceRepository
import io.charlescd.moove.domain.service.ManagementUserSecurityService
import io.charlescd.moove.infrastructure.service.DeployClientService
import io.charlescd.moove.infrastructure.service.client.DeployClient
import spock.lang.Specification

class CreateDeploymentConfigurationInteractorImplTest extends Specification {

    private CreateDeploymentConfigurationInteractor createDeploymentConfigurationInteractor
    private DeploymentConfigurationRepository deploymentConfigurationRepository = Mock(DeploymentConfigurationRepository)
    private UserRepository userRepository = Mock(UserRepository)
    private WorkspaceRepository workspaceRepository = Mock(WorkspaceRepository)
    private DeployClient deployClient = Mock(DeployClient)
    private ManagementUserSecurityService managementUserSecurityService = Mock(ManagementUserSecurityService)
    private UserService userService = new UserService(userRepository, managementUserSecurityService)
    private DeployClientService deployClientService = new DeployClientService(deployClient)
    private WorkspaceService workspaceService = new WorkspaceService(workspaceRepository, userRepository)

    void setup() {
        this.createDeploymentConfigurationInteractor = new CreateDeploymentConfigurationInteractorImpl(
                deploymentConfigurationRepository,
                userService,
                deployClientService,
                workspaceService
        )
    }

    def "when workspace does not exist should throw not found exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def request = new CreateDeploymentConfigurationRequest("Test Config", "butler-url", "namespace", "token", GitProviderEnum.GITHUB)

        when:
        this.createDeploymentConfigurationInteractor.execute(request, workspaceId, authorization)

        then:
        1 * workspaceRepository.exists(workspaceId) >> false

        def ex = thrown(NotFoundException)
        ex.resourceName == "workspace"
        ex.id == workspaceId
    }

    def "when fail to validate butler url should throw business exception"() {
        given:
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def request = new CreateDeploymentConfigurationRequest("Test Config", "butler-url", "namespace", "token", GitProviderEnum.GITHUB)

        when:
        this.createDeploymentConfigurationInteractor.execute(request, workspaceId, authorization)

        then:
        1 * workspaceRepository.exists(workspaceId) >> true
        1 * deployClient.healthCheck(URI.create(request.butlerUrl)) >> { arguments ->
            throw new FeignException()
        }

        def ex = thrown(BusinessException)
        ex.errorCode == MooveErrorCode.INVALID_BUTLER_URL_ERROR
    }

    def "when fail to find user by authorization should throw not found exception"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def request = new CreateDeploymentConfigurationRequest("Test Config", "butler-url", "namespace", "token", GitProviderEnum.GITHUB)

        when:
        this.createDeploymentConfigurationInteractor.execute(request, workspaceId, authorization)

        then:
        1 * workspaceRepository.exists(workspaceId) >> true
        1 * deployClient.healthCheck(URI.create(request.butlerUrl))
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.empty()

        def ex = thrown(NotFoundException)
        ex.resourceName == "user"
        ex.id == author.email
    }

    def "should create deployment configuration successfully"() {
        given:
        def author = TestUtils.user
        def workspaceId = TestUtils.workspaceId
        def authorization = TestUtils.authorization
        def request = new CreateDeploymentConfigurationRequest("Test Config", "butler-url", "namespace", "token", GitProviderEnum.GITHUB)

        when:
        def deploymentConfigurationResponse = this.createDeploymentConfigurationInteractor.execute(request, workspaceId, authorization)

        then:
        1 * workspaceRepository.exists(workspaceId) >> true
        1 * deployClient.healthCheck(URI.create(request.butlerUrl))
        1 * managementUserSecurityService.getUserEmail(authorization) >> author.email
        1 * userRepository.findByEmail(author.email) >> Optional.of(author)
        1 * deploymentConfigurationRepository.save(_) >> { argument ->
            def savedDeploymentConfiguration = argument[0]
            assert savedDeploymentConfiguration instanceof DeploymentConfiguration
            assert savedDeploymentConfiguration.id != null
            assert savedDeploymentConfiguration.name == request.name
            assert savedDeploymentConfiguration.createdAt != null
            assert savedDeploymentConfiguration.author.id == author.id
            assert savedDeploymentConfiguration.workspaceId == workspaceId
            assert savedDeploymentConfiguration.butlerUrl == request.butlerUrl
            assert savedDeploymentConfiguration.namespace == request.namespace
            assert savedDeploymentConfiguration.gitToken == request.gitToken
            assert savedDeploymentConfiguration.gitProvider == request.gitProvider

            return savedDeploymentConfiguration
        }

        notThrown()

        assert deploymentConfigurationResponse != null
        assert deploymentConfigurationResponse.id != null
        assert deploymentConfigurationResponse.name == request.name
    }

}
