/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.persistence;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;

public class DockerRegistryConfigurationEntity {

    public String id;
    public String name;
    public RegistryType type;
    public String applicationId;
    public String authorId;
    public DockerRegistryConnectionData connectionData;
    public LocalDateTime createdAt;

    public static abstract class DockerRegistryConnectionData {
        public String address;
        public String host;

        DockerRegistryConnectionData(String address) {
            this.address = address;
            // Removing protocol :(
            this.host = StringUtils.substringAfter(address, "//");
        }
    }

    public static class AWSDockerRegistryConnectionData extends DockerRegistryConnectionData {
        public String accessKey;
        public String secretKey;
        public String region;

        public AWSDockerRegistryConnectionData(String address, String accessKey, String secretKey, String region) {
            super(address);
            this.accessKey = accessKey;
            this.secretKey = secretKey;
            this.region = region;
        }
    }

    public static class AzureDockerRegistryConnectionData extends DockerRegistryConnectionData {
        public String username;
        public String password;

        public AzureDockerRegistryConnectionData(String address, String username, String password) {
            super(address);
            this.username = username;
            this.password = password;
        }
    }

}
