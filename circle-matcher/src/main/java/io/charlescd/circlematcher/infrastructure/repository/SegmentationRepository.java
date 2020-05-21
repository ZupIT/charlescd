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

import io.charlescd.circlematcher.domain.Segmentation;
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
