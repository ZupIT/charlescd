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

package br.com.zup.charlescd.villager.interactor.registry.impl;

import br.com.zup.charlescd.villager.infrastructure.persistence.DockerRegistryConfigurationRepository;
import br.com.zup.charlescd.villager.interactor.registry.DockerRegistryDTO;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryInput;
import br.com.zup.charlescd.villager.interactor.registry.ListDockerRegistryInteractor;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ListDockerRegistryInteractorImpl implements ListDockerRegistryInteractor {

    private DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository;

    @Inject
    public ListDockerRegistryInteractorImpl(DockerRegistryConfigurationRepository dockerRegistryConfigurationRepository) {
        this.dockerRegistryConfigurationRepository = dockerRegistryConfigurationRepository;
    }

    @Override
    public List<DockerRegistryDTO> execute(ListDockerRegistryInput input) {
        var dockerRegistryList = dockerRegistryConfigurationRepository.listByWorkspaceId(input.getWorkspaceId());
        return dockerRegistryList.stream()
                .map(entity -> new DockerRegistryDTO(entity.id, entity.name, entity.type, entity.authorId))
                .collect(Collectors.toList());
    }
}
