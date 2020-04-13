/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.AWSDockerRegistryAuth;
import br.com.zup.charlescd.villager.interactor.registry.AzureDockerRegistryAuth;
import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import br.com.zup.charlescd.villager.interactor.registry.SaveDockerRegistryConfigurationInteractor;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class SaveDockerRegistryConfigurationInteractorImpl implements SaveDockerRegistryConfigurationInteractor {

    private DockerRegistryConfigurationRepository repository;

    @Inject
    public SaveDockerRegistryConfigurationInteractorImpl(DockerRegistryConfigurationRepository repository) {
        this.repository = repository;
    }

    @Override
    public String execute(DockerRegistryConfigurationInput input) {

        var entity = new DockerRegistryConfigurationEntity();

        entity.name = input.getName();
        entity.type = input.getRegistryType();
        entity.applicationId = input.getWorkspaceId();
        entity.authorId = input.getAuthorId();
        entity.connectionData = convertToConnectionData(input);
        repository.save(entity);

        return entity.id;
    }

    private DockerRegistryConfigurationEntity.DockerRegistryConnectionData convertToConnectionData(DockerRegistryConfigurationInput input) {
        DockerRegistryConfigurationEntity.DockerRegistryConnectionData connectionData;
        switch (input.getRegistryType()) {
            case AWS:
                var awsRegistryAuth = ((AWSDockerRegistryAuth) input.getAuth());
                connectionData = new DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData(input.getAddress(), awsRegistryAuth.getAccessKey(), awsRegistryAuth.getSecretKey(), awsRegistryAuth.getRegion());
                break;
            case AZURE:
                var azureRegistryAuth = ((AzureDockerRegistryAuth) input.getAuth());
                connectionData = new DockerRegistryConfigurationEntity.AzureDockerRegistryConnectionData(input.getAddress(), azureRegistryAuth.getUsername(), azureRegistryAuth.getPassword());
                break;
            default:
                throw new IllegalStateException("Registry type not supported!");
        }
        return connectionData;
    }

}
