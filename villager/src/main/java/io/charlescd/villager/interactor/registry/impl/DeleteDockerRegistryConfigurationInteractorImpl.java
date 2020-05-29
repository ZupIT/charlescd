package io.charlescd.villager.interactor.registry.impl;

import io.charlescd.villager.exceptions.ResourceNotFoundException;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import io.charlescd.villager.interactor.registry.DeleteDockerRegistryConfigurationInteractor;
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
