package io.charlescd.villager.test;

import com.amazonaws.services.ecr.AmazonECR;
import com.amazonaws.services.ecr.AmazonECRClientBuilder;
import com.amazonaws.services.ecr.model.AuthorizationData;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenRequest;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenResult;

import org.junit.jupiter.api.Test;
import org.mockito.Spy;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;


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
