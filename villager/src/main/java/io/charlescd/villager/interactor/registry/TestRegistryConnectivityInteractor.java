package io.charlescd.villager.interactor.registry;

@FunctionalInterface
public interface TestRegistryConnectivityInteractor {
    void execute(TestDockerRegistryConnectionInput input);
}
