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

package io.charlescd.villager.infrastructure.integration.registry.authentication;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSCredentialsProviderChain;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.EC2ContainerCredentialsProviderWrapper;
import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.auth.SystemPropertiesCredentialsProvider;
import com.amazonaws.auth.WebIdentityTokenCredentialsProvider;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.ecr.AmazonECRClientBuilder;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenRequest;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenResult;
import java.util.LinkedList;
import java.util.List;

public final class AWSCustomProviderChainAuthenticator extends AbstractBasicAuthenticator {

    private String region;
    private List<AWSCredentialsProvider> providerChain = new LinkedList<>();

    public AWSCustomProviderChainAuthenticator(String region) {
        this.region = region;

        providerChain.add(new EnvironmentVariableCredentialsProvider());
        providerChain.add(new SystemPropertiesCredentialsProvider());
        providerChain.add(new WebIdentityTokenCredentialsProvider());
        providerChain.add(new ProfileCredentialsProvider());
        providerChain.add(new EC2ContainerCredentialsProviderWrapper());
    }

    public void addProviderAsPrimary(AWSCredentialsProvider provider) {
        providerChain.add(0, provider);
    }

    private AWSCredentials getCredentials() {
        return new AWSCredentialsProviderChain(providerChain).getCredentials();
    }

    @Override
    public String loadBasicAuthorization() {

        AWSCredentials awsCredentials = getCredentials();
        AmazonECRClientBuilder amazonECRBuilder = AmazonECRClientBuilder.standard()
                .withRegion(this.region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials));

        GetAuthorizationTokenResult authorizationToken = amazonECRBuilder.build()
                .getAuthorizationToken(new GetAuthorizationTokenRequest());

        return String.format("Basic %s", authorizationToken.getAuthorizationData().get(0).getAuthorizationToken());
    }

}
