/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.handlers.impl;

import br.com.zup.charlescd.villager.api.handlers.RequestHandler;
import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryConfigurationInput;
import br.com.zup.charlescd.villager.api.resources.registry.AWSCreateDockerRegistryRequest;
import br.com.zup.charlescd.villager.api.resources.registry.AzureCreateDockerRegistryRequest;
import br.com.zup.charlescd.villager.api.resources.registry.CreateDockerRegistryConfigurationRequest;
import br.com.zup.charlescd.villager.interactor.registry.AWSDockerRegistryAuth;
import br.com.zup.charlescd.villager.interactor.registry.AzureDockerRegistryAuth;

public class CreateDockerRegistryRequestHandler implements RequestHandler<DockerRegistryConfigurationInput> {

    private CreateDockerRegistryConfigurationRequest request;
    private String applicationId;

    public CreateDockerRegistryRequestHandler(String applicationId, CreateDockerRegistryConfigurationRequest request) {
        this.applicationId = applicationId;
        this.request = request;
    }

    @Override
    public DockerRegistryConfigurationInput handle() {

        var inputBuilder = DockerRegistryConfigurationInput.builder()
                .withName(this.request.getName())
                .withAddress(this.request.getAddress())
                .withApplicationId(this.applicationId)
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
