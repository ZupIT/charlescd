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

package io.charlescd.villager.test;

import com.amazonaws.services.ecr.AmazonECR;
import com.amazonaws.services.ecr.model.AuthorizationData;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenResult;

import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.spy;


import java.util.ArrayList;
import java.util.Collection;

import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSBasicCredentialsProvider;
import io.charlescd.villager.infrastructure.integration.registry.authentication.AWSCustomProviderChainAuthenticator;
import io.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationEntity.AWSDockerRegistryConnectionData;

public class AWSCustomProviderChainAuthenticatorTest {

    @Test
    public void testAWSBasicProvider() {

        AWSDockerRegistryConnectionData awsConfig = new AWSDockerRegistryConnectionData("host", "sfhkdjfskd", "fghdjhfghsjkdf", "sa-east-1");
        AWSCustomProviderChainAuthenticator awsCustomProviderChainAuthenticatorMock = spy( new AWSCustomProviderChainAuthenticator(awsConfig.region));
        AuthorizationData authorizationDataMock = new AuthorizationData();
        String exampleToken = "YWxhZGRpbjpvcGVuc2VzYW1";
        authorizationDataMock.setAuthorizationToken(exampleToken);

        Collection<AuthorizationData> collectionAuthorizationMock = new ArrayList<AuthorizationData>();
        collectionAuthorizationMock.add(authorizationDataMock);

        GetAuthorizationTokenResult mockResult = new GetAuthorizationTokenResult();
        mockResult.setAuthorizationData(collectionAuthorizationMock);
        
        doAnswer(invocationResponse -> {
            return mockResult;
        }).when(awsCustomProviderChainAuthenticatorMock).getAuthorizationToken(any(AmazonECR.class));

    
        awsCustomProviderChainAuthenticatorMock.addProviderAsPrimary(new AWSBasicCredentialsProvider(awsConfig.accessKey, awsConfig.secretKey));
        
        String resultToken = awsCustomProviderChainAuthenticatorMock.loadBasicAuthorization();
        

        assertThat(resultToken, is("Basic " + exampleToken));
  }
}
