package io.charlescd.circlematcher.api.configuration;

import io.charlescd.circlematcher.domain.KeyMetadata;
import io.charlescd.circlematcher.domain.Segmentation;
import io.charlescd.circlematcher.domain.SegmentationType;
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository;
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Optional;

@Component
public class ApplicationReadyListener implements ApplicationListener<ApplicationReadyEvent> {
    private KeyMetadataRepository keyMetadataRepository;
    private SegmentationRepository segmentationRepository;
    public ApplicationReadyListener(KeyMetadataRepository keyMetadataRepository,
                                    SegmentationRepository segmentationRepository){
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
            var optionalSegmentation = findSegmentation(keyMetadata);
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
