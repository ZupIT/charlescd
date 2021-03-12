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

package io.charlescd.villager.infrastructure.integration.registry;

import io.charlescd.villager.infrastructure.integration.registry.configuration.AwsConfig;
import io.charlescd.villager.infrastructure.integration.registry.configuration.AzureConfig;
import io.charlescd.villager.infrastructure.integration.registry.configuration.ConfigParameters;
import io.charlescd.villager.infrastructure.integration.registry.configuration.DockerHubConfig;
import io.charlescd.villager.infrastructure.integration.registry.configuration.GcpConfig;
import io.charlescd.villager.infrastructure.integration.registry.configuration.HarborConfig;
import java.util.function.Function;

public enum RegistryType {

    AWS(AwsConfig::execute),
    AZURE(AzureConfig::execute),
    GCP(GcpConfig::execute),
    DOCKER_HUB(DockerHubConfig::execute),
    HARBOR(HarborConfig::execute),
    UNSUPPORTED(x -> {
        throw new IllegalArgumentException("Registry type is not supported!");
    });

    private Function<ConfigParameters, Object> function;

    RegistryType(Function<ConfigParameters, Object> function) {
        this.function = function;
    }

    public Object configure(ConfigParameters config) {
        return function.apply(config);
    }
}
