/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
        var dockerRegistryList = dockerRegistryConfigurationRepository.listByApplicationId(input.getApplicationId());
        return dockerRegistryList.stream()
                .map(entity -> new DockerRegistryDTO(entity.id, entity.name, entity.type, entity.authorId))
                .collect(Collectors.toList());
    }
}
