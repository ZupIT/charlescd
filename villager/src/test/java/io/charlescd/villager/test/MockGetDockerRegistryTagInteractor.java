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
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInput;
import io.charlescd.villager.interactor.registry.GetDockerRegistryTagInteractor;
import io.quarkus.test.Mock;
import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

@Mock
@ApplicationScoped
public class MockGetDockerRegistryTagInteractor implements GetDockerRegistryTagInteractor {

    @Override
    public Optional<ComponentTagDTO> execute(GetDockerRegistryTagInput input) {
        return null;
    }
}
