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

import io.charlescd.villager.interactor.registry.ComponentTagDTO;
import io.charlescd.villager.interactor.registry.ListDockerRegistryTagsInput;
import io.charlescd.villager.interactor.registry.ListDockerRegistryTagsInteractor;
import io.quarkus.test.Mock;
import java.util.List;
import javax.enterprise.context.ApplicationScoped;

@Mock
@ApplicationScoped
public class MockListDockerRegistryTagsInteractor implements ListDockerRegistryTagsInteractor {

    @Override
    public List<ComponentTagDTO> execute(ListDockerRegistryTagsInput input) {
        return null;
    }
}
