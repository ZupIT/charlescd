package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.exceptions.ResourceNotFoundException;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.DeleteDockerRegistryConfigurationInteractor;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class DeleteDockerRegistryConfigurationInteractorImpl implements DeleteDockerRegistryConfigurationInteractor {

    private DockerRegistryConfigurationRepository repository;

    @Inject
    public DeleteDockerRegistryConfigurationInteractorImpl(DockerRegistryConfigurationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void execute(String registryId, String workspaceId) {
        checkIfRegistryExists(registryId, workspaceId);
        repository.delete(registryId, workspaceId);
    }

    private void checkIfRegistryExists(String registryId, String workspaceId) {
        if (!repository.exists(registryId, workspaceId)) {
            throw new ResourceNotFoundException(ResourceNotFoundException.ResourceEnum.DOCKER_REGISTRY);
        }
    }

}
