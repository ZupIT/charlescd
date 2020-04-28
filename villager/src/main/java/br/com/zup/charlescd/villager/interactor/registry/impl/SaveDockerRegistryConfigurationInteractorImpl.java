/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity;
import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.AWSDockerRegistryAuth;
import br.com.zup.charlescd.villager.interactor.registry.AzureDockerRegistryAuth;
import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import br.com.zup.charlescd.villager.interactor.registry.SaveDockerRegistryConfigurationInteractor;

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
        entity.workspaceId = input.getWorkspaceId();
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
