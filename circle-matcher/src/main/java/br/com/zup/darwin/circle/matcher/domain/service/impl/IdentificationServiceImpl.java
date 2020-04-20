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

package br.com.zup.darwin.circle.matcher.domain.service.impl;

import br.com.zup.darwin.circle.matcher.domain.Circle;
import br.com.zup.darwin.circle.matcher.domain.KeyMetadata;
import br.com.zup.darwin.circle.matcher.domain.Segmentation;
import br.com.zup.darwin.circle.matcher.domain.SegmentationType;
import br.com.zup.darwin.circle.matcher.domain.service.IdentificationService;
import br.com.zup.darwin.circle.matcher.infrastructure.SegmentationKeyUtils;
import br.com.zup.darwin.circle.matcher.infrastructure.repository.KeyMetadataRepository;
import br.com.zup.darwin.circle.matcher.infrastructure.repository.SegmentationRepository;
import org.paukov.combinatorics3.Generator;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class IdentificationServiceImpl implements IdentificationService {

    // TODO: check save on distribution config
    private static final String DEFAULT_CIRCLE_ID = "f5d23a57-5607-4306-9993-477e1598cc2a";

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

    public Set<Circle> identify(Map<String, Object> request) {
        verifyRequestFormat(request);

        var keySubsets = createKeySubsets(request);
        var keyMetadata = this.keyMetadataRepository.find();
        var intersection = extractIntersection(keySubsets, keyMetadata);

        return findMatchedCircles(request, intersection);
    }

    private Optional<Segmentation> findSegmentation(KeyMetadata metadata, Map<String, Object> request) {

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
                .filter(item -> keySubsets.contains(
                        SegmentationKeyUtils.extract(item.getKey()))
                )
                .collect(Collectors.toList());
    }

    private List<String> createKeySubsets(Map<String, Object> request) {
        var subsets = Generator.subset(request.keySet())
                .simple()
                .stream()
                .filter(item -> !item.isEmpty())
                .collect(Collectors.toList());

        subsets.stream().parallel().forEach(Collections::sort);

        return subsets.stream()
                .map(item -> String.join("_", item))
                .collect(Collectors.toList());
    }

    private Set<Circle> findMatchedCircles(Map<String, Object> request, List<KeyMetadata> metadata) {
        var matched = metadata.stream()
                .parallel()
                .map(item -> findSegmentation(item, request))
                .filter(item -> item.isPresent() && isMatched(request, item.get()))
                .map(item -> new Circle(item.get().getCircleId(), item.get().getName()))
                .collect(Collectors.toSet());

        if (matched.isEmpty()) {
            matched.add(new Circle(DEFAULT_CIRCLE_ID, "Open Sea"));
        }

        return matched;
    }

    private void verifyRequestFormat(Map<String, Object> request) {
        for (var entry : request.entrySet()) {
            if (entry.getValue() instanceof Map || entry.getValue() instanceof List) {
                throw new IllegalArgumentException("Matcher doesn't support nested json properties.");
            }
        }
    }

    private boolean isMember(KeyMetadata metadata, Map<String, Object> request) {
        return this.segmentationRepository
                .isMember(metadata.getKey(),
                        (String) request.get(
                                SegmentationKeyUtils.extract(metadata.getKey())
                        )
                );
    }

    private boolean isMatched(Map<String, Object> request, Segmentation item) {
        return item.getType().equals(SegmentationType.SIMPLE_KV) ||
                this.scriptManagerService.isMatch(item.getNode(), request);
    }

}
