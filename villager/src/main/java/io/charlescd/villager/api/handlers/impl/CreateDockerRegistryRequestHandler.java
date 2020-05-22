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

package io.charlescd.villager.api.handlers.impl;

import io.charlescd.villager.api.handlers.RequestHandler;
import io.charlescd.villager.infrastructure.integration.registry.RegistryType;
import io.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import io.charlescd.villager.api.resources.registry.AWSCreateDockerRegistryRequest;
import io.charlescd.villager.api.resources.registry.AzureCreateDockerRegistryRequest;
import io.charlescd.villager.api.resources.registry.CreateDockerRegistryConfigurationRequest;
import io.charlescd.villager.interactor.registry.AWSDockerRegistryAuth;
import io.charlescd.villager.interactor.registry.AzureDockerRegistryAuth;

public class CreateDockerRegistryRequestHandler implements RequestHandler<DockerRegistryConfigurationInput> {

    private CreateDockerRegistryConfigurationRequest request;
    private String workspaceId;

    public CreateDockerRegistryRequestHandler(String workspaceId, CreateDockerRegistryConfigurationRequest request) {
        this.workspaceId = workspaceId;
        this.request = request;
    }

    @Override
    public DockerRegistryConfigurationInput handle() {

        var inputBuilder = DockerRegistryConfigurationInput.builder()
                .withName(this.request.getName())
                .withAddress(this.request.getAddress())
                .withWorkspaceId(this.workspaceId)
                .withAuthorId(this.request.getAuthorId());

        if (this.request instanceof AzureCreateDockerRegistryRequest) {
            toAzure(inputBuilder);
        } else if(this.request instanceof AWSCreateDockerRegistryRequest) {
            toAWS(inputBuilder);
        } else {
            throw new IllegalArgumentException("The request has a invalid format.");
        }

        return inputBuilder.build();
    }

    private void toAWS(DockerRegistryConfigurationInput.RegistryConfigurationInputBuilder inputBuilder) {
        var awsRequest = (AWSCreateDockerRegistryRequest) request;
        inputBuilder
                .withRegistryType(RegistryType.AWS)
                .withAuth(new AWSDockerRegistryAuth(awsRequest.getAccessKey(), awsRequest.getSecretKey(), awsRequest.getRegion()));
    }

    private void toAzure(DockerRegistryConfigurationInput.RegistryConfigurationInputBuilder inputBuilder) {
        var azureRequest = (AzureCreateDockerRegistryRequest) request;
        inputBuilder
                .withRegistryType(RegistryType.AZURE)
                .withAuth(new AzureDockerRegistryAuth(azureRequest.getUsername(), azureRequest.getPassword()));
    }
}
