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

import io.charlescd.circlematcher.api.request.CreateSegmentationRequest;
import io.charlescd.circlematcher.api.request.SegmentationRequest;
import io.charlescd.circlematcher.api.request.UpdateSegmentationRequest;
import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Node;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.domain.exception.BusinessException;
import io.charlescd.circlematcher.domain.exception.MatcherErrorCode;
import io.charlescd.circlematcher.domain.service.SegmentationService;
import io.charlescd.circlematcher.infrastructure.SegmentationKeyUtils;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SegmentationServiceImpl implements SegmentationService {

    private SegmentationRepository segmentationRepository;
    private KeyMetadataRepository keyMetadataRepository;

    public SegmentationServiceImpl(SegmentationRepository segmentationRepository,
                                   KeyMetadataRepository keyMetadataRepository) {
        this.segmentationRepository = segmentationRepository;
        this.keyMetadataRepository = keyMetadataRepository;
    }

    public void create(CreateSegmentationRequest request) {
        validateSegmentation(request);
        var segmentation = decomposeSegmentation(request);

        segmentation.forEach(this::createSegmentationData);
    }

    public void update(UpdateSegmentationRequest updateSegmentationRequest) {
        validateSegmentation(updateSegmentationRequest);
        var previousMetadata = this.keyMetadataRepository.findByReference(
                updateSegmentationRequest.getPreviousReference()
        );

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

        if (!segmentation.getIsDefault()) {
            if (SegmentationType.SIMPLE_KV.equals(segmentation.getType())) {
                this.segmentationRepository.create(key, getSegmentationValue(segmentation));
            } else {
                this.segmentationRepository.create(key, segmentation);
            }
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
                    item.isConvertibleToKv() ? SegmentationType.SIMPLE_KV : segmentationRequest.getType(),
                    segmentationRequest.getWorkspaceId(),
                    segmentationRequest.getIsDefault(),
                    segmentationRequest.getPercentage(),
                    segmentationRequest.isActive(),
                    segmentationRequest.getCreatedAt())));

            return segmentation;
        }

        segmentation.add(segmentationRequest.toSegmentation());

        return segmentation;
    }

    private void recursiveNodeExtraction(Node node, List<Node> nodes) {
        if (node.isDecomposable()) {
            node.getClauses().forEach(item -> recursiveNodeExtraction(item, nodes));
        } else {
            nodes.add(node);
        }
    }

    private boolean shouldDecompose(SegmentationRequest segmentationRequest) {
        return SegmentationType.REGULAR.equals(segmentationRequest.getType()) && !segmentationRequest.getIsDefault();
    }

    private void validateSegmentation(SegmentationRequest request) {
        var isUpdate = request instanceof UpdateSegmentationRequest;

        if (!request.getIsDefault()) {
            return;
        }
        if (isUpdate) {
            throw new BusinessException(
                    MatcherErrorCode.CANNOT_UPDATE_DEFAULT_SEGMENTATION,
                    "Error updating segmentation"
            );
        }

        var metadataList = this.keyMetadataRepository.findByWorkspaceId(request.getWorkspaceId());
        var hasMetadataDefault = metadataList.stream().parallel()
                .anyMatch(keyMetadata -> keyMetadata.getIsDefault());
        if (hasMetadataDefault) {
            throw new BusinessException(
                    MatcherErrorCode.DEFAULT_SEGMENTATION_ALREADY_REGISTERED_IN_WORKSPACE,
                    "segmentationRequest/workspaceId",
                    "Error creating segmentation ")
                    .withParameters(request.getWorkspaceId());
        }
    }

}


