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

package io.charlescd.circlematcher.configuration

import io.charlescd.circlematcher.api.configuration.ApplicationReadyListener
import io.charlescd.circlematcher.domain.KeyMetadata
import io.charlescd.circlematcher.domain.SegmentationType
import io.charlescd.circlematcher.infrastructure.repository.KeyMetadataRepository
import io.charlescd.circlematcher.infrastructure.repository.SegmentationRepository
import io.charlescd.circlematcher.utils.TestUtils
import org.springframework.boot.context.event.ApplicationReadyEvent
import spock.lang.Specification


class ApplicationReadyEventTest extends Specification {

    def "if no metadata has been found should not create or remove segmentation" () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV, true)
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> []
        0 * keymetadatRepository.create(keyMetadata)
        0 * keymetadatRepository.remove(keyMetadata)
        0 * segmentationRepository.removeByKey(content.getKey())
        0 * segmentationRepository.create(content.getKey(), segmentation)

    }
    def "if found metadata and is  simple_kv should update metadata but not update segmentation " () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.SIMPLE_KV, true)
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> [keyMetadata]
        1 * keymetadatRepository.create(keyMetadata)
        1 * keymetadatRepository.remove(keyMetadata)
        0 * segmentationRepository.removeByKey(content.getKey())
        0 * segmentationRepository.create(content.getKey(), segmentation)
    }
    def "if found metadata and is regular should update metadata and update segmentation " () {
        def value = "user@zup.com.br"
        def content = TestUtils.createContent([value])
        def node = TestUtils.createNode(content)
        def segmentation = TestUtils.createSegmentation(node, SegmentationType.REGULAR, true)
        def keyMetadata = new KeyMetadata(content.getKey(), segmentation)
        given:
        def segmentationRepository  = Mock(SegmentationRepository)
        def keymetadatRepository  = Mock(KeyMetadataRepository)
        def applicationReadyEvent  = Mock(ApplicationReadyEvent)
        def applicationReadyListener = new ApplicationReadyListener(keymetadatRepository, segmentationRepository)
        when:
        applicationReadyListener.onApplicationEvent(applicationReadyEvent)
        then:
        1 * keymetadatRepository.findAllOldMetadata() >> [keyMetadata]
        1 * segmentationRepository.findByKey(content.getKey()) >> Optional.of(segmentation)
        1 * keymetadatRepository.create(keyMetadata)
        1 * keymetadatRepository.remove(keyMetadata)
        1 * segmentationRepository.removeByKey(content.getKey())
        1 * segmentationRepository.create(content.getKey(), segmentation)
    }
}
