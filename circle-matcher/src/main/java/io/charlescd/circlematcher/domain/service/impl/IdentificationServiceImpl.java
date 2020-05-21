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

package io.charlescd.circlematcher.domain.service.impl;

import io.charlescd.circlematcher.api.request.IdentificationRequest;
import io.charlescd.circlematcher.domain.Circle;
import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.domain.service.IdentificationService;
import io.charlescd.circlematcher.infrastructure.SegmentationKeyUtils;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;
import org.paukov.combinatorics3.Generator;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IdentificationServiceImpl implements IdentificationService {

    private SegmentationRepository segmentationRepository;
    private ScriptManagerServiceImpl scriptManagerService;
    private KeyMetadataRepository keyMetadataRepository;

    public IdentificationServiceImpl(SegmentationRepository segmentationRepository,
                                     ScriptManagerServiceImpl scriptManagerService,
                                     KeyMetadataRepository keyMetadataRepository) {
        this.segmentationRepository = segmentationRepository;
        this.scriptManagerService = scriptManagerService;
        this.keyMetadataRepository = keyMetadataRepository;
    }

    public Set<Circle> identify(IdentificationRequest request) {
        verifyRequestFormat(request);

        var keySubsets = createKeySubsets(request);
        var keyMetadata = this.keyMetadataRepository.findByWorkspaceId(request.getWorkspaceId());
        var intersection = extractIntersection(keySubsets, keyMetadata);

        return findMatchedCircles(request, intersection);
    }

    private Optional<Segmentation> findSegmentation(KeyMetadata metadata, IdentificationRequest request) {
        if (SegmentationType.SIMPLE_KV.equals(metadata.getType())) {
            if (isMember(metadata, request)) {
                return Optional.of(Segmentation.of(metadata));
            }

            return Optional.empty();
        }

        return this.segmentationRepository
                .findByKey(metadata.getKey());
    }

    private List<KeyMetadata> extractIntersection(List<String> keySubsets, List<KeyMetadata> keyMetadata) {
        return keyMetadata.stream()
                .filter(item -> keySubsets.contains(SegmentationKeyUtils.extract(item.getKey())) || item.getIsDefault())
                .collect(Collectors.toList());
    }

    private List<String> createKeySubsets(IdentificationRequest request) {
        var subsets = Generator.subset(request.getRequestData().keySet())
                .simple()
                .stream()
                .filter(item -> !item.isEmpty())
                .collect(Collectors.toList());

        subsets.stream().parallel().forEach(Collections::sort);

        return subsets.stream()
                .map(item -> String.join("_", item))
                .collect(Collectors.toList());
    }

    private Set<Circle> findMatchedCircles(IdentificationRequest request, List<KeyMetadata> metadata) {
        var matched = metadata.stream()
                .parallel()
                .map(item -> findSegmentation(item, request))
                .filter(item -> item.isPresent() && isMatched(request, item.get()))
                .map(item -> new Circle(item.get().getCircleId(), item.get().getName()))
                .collect(Collectors.toSet());

        if (matched.isEmpty()) {
            matched.add(createDefaultCircleFrom(metadata));
        }

        return matched;
    }

    private void verifyRequestFormat(IdentificationRequest request) {
        for (var entry : request.getRequestData().entrySet()) {
            if (entry.getValue() instanceof Map || entry.getValue() instanceof List) {
                throw new IllegalArgumentException("Matcher doesn't support nested json properties.");
            }
        }
    }

    private boolean isMember(KeyMetadata metadata, IdentificationRequest request) {
        return this.segmentationRepository
                .isMember(metadata.getKey(),
                        (String) request.getRequestData().get(
                                SegmentationKeyUtils.extract(metadata.getKey())
                        )
                );
    }

    private boolean isMatched(IdentificationRequest request, Segmentation item) {
        return item.getType().equals(SegmentationType.SIMPLE_KV) ||
                this.scriptManagerService.isMatch(item.getNode(), request.getRequestData());
    }

    private Circle createDefaultCircleFrom(List<KeyMetadata> metadata) {
        return metadata.stream()
                .filter(KeyMetadata::getIsDefault)
                .findFirst()
                .map(m -> new Circle(m.getCircleId(), m.getName()))
                .orElseThrow(() -> new NoSuchElementException("Default circle metadata not found."));
    }
}
