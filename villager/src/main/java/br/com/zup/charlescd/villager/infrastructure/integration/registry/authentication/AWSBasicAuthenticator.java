/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.integration.registry.authentication;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.ecr.AmazonECR;
import com.amazonaws.services.ecr.AmazonECRClientBuilder;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenRequest;
import com.amazonaws.services.ecr.model.GetAuthorizationTokenResult;

public class AWSBasicAuthenticator extends AbstractBasicAuthenticator {

    private String region;
    private String accessKey;
    private String secretKey;

    public AWSBasicAuthenticator(String region, String accessKey, String secretKey) {
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
