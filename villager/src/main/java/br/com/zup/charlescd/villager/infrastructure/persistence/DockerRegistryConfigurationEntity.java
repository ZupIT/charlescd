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

package br.com.zup.charlescd.villager.infrastructure.persistence;

import br.com.zup.charlescd.villager.infrastructure.integration.registry.RegistryType;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDateTime;

public class DockerRegistryConfigurationEntity {

    public String id;
    public String name;
    public RegistryType type;
    public String workspaceId;
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
