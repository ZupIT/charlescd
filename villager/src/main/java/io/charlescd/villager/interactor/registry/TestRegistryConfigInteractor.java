package io.charlescd.villager.interactor.registry;

@FunctionalInterface
public interface TestRegistryConfigInteractor {
    void execute(DockerRegistryConfigurationInput input);
}
