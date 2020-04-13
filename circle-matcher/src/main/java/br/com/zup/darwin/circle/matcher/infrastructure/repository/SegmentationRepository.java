/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure.repository;

import br.com.zup.darwin.circle.matcher.domain.Segmentation;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SegmentationRepository implements RedisRepository {

    private RedisTemplate<String, Object> template;
    private ObjectMapper objectMapper;

    public SegmentationRepository(RedisTemplate<String, Object> template,
                                  ObjectMapper objectMapper) {
        this.template = template;
        this.objectMapper = objectMapper;
    }

    public Optional<Segmentation> findByKey(String key) {
        var cursor = this.template.opsForSet().scan(key, ScanOptions.scanOptions().build());

        if (!cursor.isClosed() && cursor.hasNext()) {

            Object record = cursor.next();
            closeCursor(cursor);

            return Optional.of(this.objectMapper
                    .convertValue(record, Segmentation.class)
            );
        }

        closeCursor(cursor);

        return Optional.empty();
    }

    public Boolean isMember(String key, String value) {
        return this.template.opsForSet().isMember(key, value);
    }

    public void create(String key, Object segmentation) {
        this.template.opsForSet().add(key, segmentation);
    }

    public void removeByKey(String key) {
        this.template.delete(key);
    }
}
