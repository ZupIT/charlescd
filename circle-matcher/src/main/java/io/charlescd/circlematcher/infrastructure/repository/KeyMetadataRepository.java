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

package io.charlescd.circlematcher.infrastructure.repository;

import io.charlescd.circlematcher.domain.KeyMetadata;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class KeyMetadataRepository implements RedisRepository {

    private RedisTemplate<String, Object> template;
    private ObjectMapper objectMapper;
    private static final String CHARLES_KEY_SET = "charles-key-set";

    public KeyMetadataRepository(RedisTemplate<String, Object> template, ObjectMapper objectMapper) {
        this.template = template;
        this.objectMapper = objectMapper;
    }

    public KeyMetadata create(KeyMetadata keyMetadata) {
        this.template.opsForSet().add(CHARLES_KEY_SET, keyMetadata);
        return keyMetadata;
    }

    public List<KeyMetadata> findByWorkspaceId(String workspaceId) {
        var metadataList = new ArrayList<KeyMetadata>();
        var cursor = this.template.opsForSet().scan(CHARLES_KEY_SET, ScanOptions.scanOptions()
                .match(String.format("*\"workspaceId\":\"%s\"*", workspaceId))
                .build());

        while (!cursor.isClosed() && cursor.hasNext()) {
            var metadata = this.objectMapper.convertValue(cursor.next(), KeyMetadata.class);
            metadataList.add(metadata);
        }

        closeCursor(cursor);

        return metadataList;
    }

    public List<KeyMetadata> findByReference(String reference) {
        var metadataList = new ArrayList<KeyMetadata>();

        var cursor = this.template.opsForSet()
                .scan(CHARLES_KEY_SET, ScanOptions.scanOptions()
                        .match(String.format("*\"reference\":\"%s\"*", reference))
                        .build());

        while (!cursor.isClosed() && cursor.hasNext()) {
            var metadata = this.objectMapper.convertValue(cursor.next(), KeyMetadata.class);
            metadataList.add(metadata);
        }

        closeCursor(cursor);

        return metadataList;
    }

    public List<KeyMetadata> findByCircleId(String circleId) {

        var metadataList = new ArrayList<KeyMetadata>();

        var cursor = this.template.opsForSet()
                .scan(CHARLES_KEY_SET, ScanOptions.scanOptions()
                        .match(String.format("*\"circleId\":\"%s\"*", circleId))
                        .build());

        while (!cursor.isClosed() && cursor.hasNext()) {
            var metadata = this.objectMapper.convertValue(cursor.next(), KeyMetadata.class);
            metadataList.add(metadata);
        }

        closeCursor(cursor);

        return metadataList;
    }

    public void remove(KeyMetadata keyMetadata) {
        this.template.opsForSet().remove(CHARLES_KEY_SET, keyMetadata);
    }
}


