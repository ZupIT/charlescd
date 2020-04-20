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

import br.com.zup.darwin.circle.matcher.api.request.CreateSegmentationRequest;
import br.com.zup.darwin.circle.matcher.api.request.SegmentationRequest;
import br.com.zup.darwin.circle.matcher.api.request.UpdateSegmentationRequest;
import br.com.zup.darwin.circle.matcher.domain.*;
import br.com.zup.darwin.circle.matcher.domain.service.SegmentationService;
import br.com.zup.darwin.circle.matcher.infrastructure.SegmentationKeyUtils;
import br.com.zup.darwin.circle.matcher.infrastructure.repository.KeyMetadataRepository;
import br.com.zup.darwin.circle.matcher.infrastructure.repository.SegmentationRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SegmentationServiceImpl implements SegmentationService {

    private SegmentationRepository segmentationRepository;
    private KeyMetadataRepository keyMetadataRepository;

    public SegmentationServiceImpl(SegmentationRepository segmentationRepository, KeyMetadataRepository keyMetadataRepository) {
        this.segmentationRepository = segmentationRepository;
        this.keyMetadataRepository = keyMetadataRepository;
    }

    public void create(CreateSegmentationRequest request) {

        var segmentation = decomposeSegmentation(request);

        segmentation.forEach(this::createSegmentationData);
    }

    public void update(UpdateSegmentationRequest updateSegmentationRequest) {
        var previousMetadata = this.keyMetadataRepository.findByReference(
                updateSegmentationRequest.getPreviousReference()
        );

        var metadata = this.keyMetadataRepository.findByReference(
                updateSegmentationRequest.getReference()
        );

        if (previousMetadata.isEmpty() && metadata.isEmpty()) {
            throw new IllegalArgumentException(
                    String.format("Previous reference  %s not found.",
                            updateSegmentationRequest.getPreviousReference()
                    )
            );
        }

        previousMetadata.forEach(item -> keyMetadataRepository.remove(item));

        previousMetadata.forEach(item -> this.segmentationRepository
                .removeByKey(item.getKey())
        );

        var segmentation = decomposeSegmentation(updateSegmentationRequest);

        segmentation.forEach(this::createSegmentationData);
    }

    public void remove(String reference) {
        var metadata = this.keyMetadataRepository.findByReference(reference);

        metadata.forEach(item -> this.segmentationRepository
                .removeByKey(item.getKey())
        );

        metadata.forEach(item -> this.keyMetadataRepository.remove(item));
    }

    private void createSegmentationData(Segmentation segmentation) {
        var key = SegmentationKeyUtils.generate(segmentation);
        var metadata = new KeyMetadata(key, segmentation);
        this.keyMetadataRepository.create(metadata);

        if (SegmentationType.SIMPLE_KV.equals(segmentation.getType())) {
            this.segmentationRepository.create(key,
                    getSegmentationValue(segmentation)
            );
        } else {
            this.segmentationRepository.create(key, segmentation);
        }
    }

    private String getSegmentationValue(Segmentation segmentation) {
        return segmentation
                .getNode()
                .getContent()
                .getValue()
                .get(0);
    }

    private List<Segmentation> decomposeSegmentation(SegmentationRequest segmentationRequest) {

        var segmentation = new ArrayList<Segmentation>();

        if (shouldDecompose(segmentationRequest)) {

            var nodes = new ArrayList<Node>();

            recursiveNodeExtraction(segmentationRequest.getNode(), nodes);

            nodes.forEach(item -> segmentation.add(new Segmentation(
                    segmentationRequest.getName(),
                    item,
                    segmentationRequest.getReference(),
                    segmentationRequest.getCircleId(),
                    isItConvertibleToKv(item) ? SegmentationType.SIMPLE_KV : segmentationRequest.getType()
            )));

            return segmentation;
        }

        segmentation.add(segmentationRequest.toSegmentation());

        return segmentation;
    }

    private void recursiveNodeExtraction(Node node, List<Node> nodes) {
        if (NodeType.CLAUSE.equals(node.getType()) &&
                LogicalOperatorType.AND.equals(node.getLogicalOperator()) ||
                NodeType.RULE.equals(node.getType())) {

            nodes.add(node);

        } else if (node.getType().equals(NodeType.CLAUSE) &&
                node.getLogicalOperator().equals(LogicalOperatorType.OR)) {
            node.getClauses().forEach(item -> recursiveNodeExtraction(item, nodes));
        }
    }

    private boolean isItConvertibleToKv(Node node) {
        return NodeType.RULE.equals(node.getType()) &&
                node.getContent() != null &&
                Condition.EQUAL.name().equals(node.getContent().getCondition());
    }

    private boolean shouldDecompose(SegmentationRequest segmentationRequest) {
        return SegmentationType.REGULAR.equals(segmentationRequest.getType());
    }
}


