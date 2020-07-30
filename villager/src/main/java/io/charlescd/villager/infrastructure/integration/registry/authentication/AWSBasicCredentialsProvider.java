package io.charlescd.villager.infrastructure.integration.registry.authentication;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;

public class AWSBasicCredentialsProvider implements AWSCredentialsProvider {

    private String accessKey;
    private String secretKey;

    public AWSBasicCredentialsProvider(final String accessKey, final String secretKey) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }

    @Override
    public AWSCredentials getCredentials() {
        return new BasicAWSCredentials(accessKey, secretKey);
    }

    @Override
    public void refresh() {

    }
}
