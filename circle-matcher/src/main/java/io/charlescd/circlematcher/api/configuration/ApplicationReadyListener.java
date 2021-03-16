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

package io.charlescd.circlematcher.api.configuration;

import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;
import java.util.Optional;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class ApplicationReadyListener implements ApplicationListener<ApplicationReadyEvent> {
    private KeyMetadataRepository keyMetadataRepository;
    private SegmentationRepository segmentationRepository;

    public ApplicationReadyListener(KeyMetadataRepository keyMetadataRepository,
                                    SegmentationRepository segmentationRepository) {
        this.keyMetadataRepository = keyMetadataRepository;
        this.segmentationRepository = segmentationRepository;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent applicationReadyEvent) {
        var oldMetaData = this.keyMetadataRepository.findAllOldMetadata();
        oldMetaData.forEach(
                this::updateOldMetadata
        );
    }

    private void updateOldMetadata(KeyMetadata keyMetadata) {
        if (!keyMetadata.getIsDefault()) {
            final var optionalSegmentation = findSegmentation(keyMetadata);
            this.keyMetadataRepository.remove(keyMetadata);
            keyMetadata.setActive(true);
            this.keyMetadataRepository.create(keyMetadata);
            if (optionalSegmentation.isPresent()) {
                var segmentation = optionalSegmentation.get();
                this.segmentationRepository.removeByKey(keyMetadata.getKey());
                segmentation.setActive(true);
                this.segmentationRepository.create(keyMetadata.getKey(), segmentation);
            }
        }
    }

    private Optional<Segmentation> findSegmentation(KeyMetadata keyMetadata) {
        if (keyMetadata.getType() != SegmentationType.SIMPLE_KV) {
            return this.segmentationRepository.findByKey(keyMetadata.getKey());
        }
        return Optional.empty();
    }

}
