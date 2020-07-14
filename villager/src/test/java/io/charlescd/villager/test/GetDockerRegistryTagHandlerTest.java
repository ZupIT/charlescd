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

import io.charlescd.villager.api.handlers.impl.GetDockerRegistryTagHandler;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@ExtendWith(MockitoExtension.class)
public class GetDockerRegistryTagHandlerTest {
    @Test
    public void createInput() {
        var workspaceId = "03232654-a863-4e87-b4d0-5536ad0d119f";
        var name = "V-1.0.0";
        var componentName = "dummyComponent";
        var registryConfigurationId = "2278ba03-c61f-4ad2-aa69-05b91400c470";
        var handler = new GetDockerRegistryTagHandler(workspaceId, registryConfigurationId, componentName, name);

        var input = handler.handle();
        assertThat(input.getArtifactName(), is(componentName));
        assertThat(input.getArtifactRepositoryConfigurationId(), is(registryConfigurationId));
        assertThat(input.getName(), is(name));
        assertThat(input.getWorkspaceId(), is(workspaceId));
    }
}
