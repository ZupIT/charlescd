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
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.ecr.AmazonECR;
import com.amazonaws.services.ecr.AmazonECRClientBuilder;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenRequest;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenResult;

public final class AWSBasicAuthenticator extends AbstractBasicAuthenticator {

    private String region;
    private String accessKey;
    private String secretKey;

    public AWSBasicAuthenticator(final String region, final String accessKey, final String secretKey) {
        this.region = region;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    @Override
    public String loadBasicAuthorization() {

        AWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        AmazonECR amazonECR = AmazonECRClientBuilder.standard().withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
        GetAuthorizationTokenResult authorizationToken = amazonECR
                .getAuthorizationToken(new GetAuthorizationTokenRequest());

        return String.format("Basic %s", authorizationToken.getAuthorizationData().get(0).getAuthorizationToken());
    }

}
