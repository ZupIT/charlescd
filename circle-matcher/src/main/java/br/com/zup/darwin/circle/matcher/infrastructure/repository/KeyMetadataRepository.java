/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure.repository;

import br.com.zup.darwin.circle.matcher.domain.KeyMetadata;
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
    private static final String DARWIN_KEY_SET = "darwin-key-set";

    public KeyMetadataRepository(RedisTemplate<String, Object> template, ObjectMapper objectMapper) {
        this.template = template;
        this.objectMapper = objectMapper;
    }

    public KeyMetadata create(KeyMetadata keyMetadata) {
        this.template.opsForSet().add(DARWIN_KEY_SET, keyMetadata);
        return keyMetadata;
    }

    public List<KeyMetadata> find() {
        var metadataList = new ArrayList<KeyMetadata>();
        var keys = this.template.opsForSet().members(DARWIN_KEY_SET);

        if (keys != null) {
            for (var key : keys) {
                var metadata = this.objectMapper.convertValue(key, KeyMetadata.class);
                metadataList.add(metadata);
            }
        }

        return metadataList;
    }

    public List<KeyMetadata> findByReference(String reference) {

        var metadataList = new ArrayList<KeyMetadata>();

        var cursor = this.template.opsForSet()
                .scan(DARWIN_KEY_SET, ScanOptions.scanOptions()
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
                .scan(DARWIN_KEY_SET, ScanOptions.scanOptions()
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
        this.template.opsForSet().remove(DARWIN_KEY_SET, keyMetadata);
    }

}


