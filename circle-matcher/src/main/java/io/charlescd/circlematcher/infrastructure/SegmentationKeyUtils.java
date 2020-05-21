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

package io.charlescd.circlematcher.infrastructure;

import io.charlescd.circlematcher.domain.Node;
import io.charlescd.circlematcher.domain.Segmentation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class SegmentationKeyUtils {

    private static final String DEFAULT = "DEFAULT";

    private SegmentationKeyUtils() {
    }

    public static String extract(String key) {
        return key.split(Constants.KEY_COMPONENTS_DELIMITER)[0];
    }

    public static String generate(Segmentation segmentation) {
        var extractedKeys = new HashSet<String>();

        if (segmentation.getNode() != null) {
            extractNodeKeys(segmentation.getNode(), extractedKeys);
        } else if (segmentation.getIsDefault()) {
            extractedKeys.add(DEFAULT);
        }

        var keys = new ArrayList<>(extractedKeys);

        Collections.sort(keys);

        return String.join(Constants.KEY_DELIMITER, keys)
                .concat(Constants.KEY_COMPONENTS_DELIMITER)
                .concat(segmentation.getReference())
                .concat(Constants.KEY_COMPONENTS_DELIMITER)
                .concat(segmentation.getType().name());
    }

    private static void extractNodeKeys(Node node, Set<String> keys) {
        if (node.getContent() != null) {
            keys.add(node.getContent().getKey());
        }

        if (node.getClauses() != null && !node.getClauses().isEmpty()) {
            node.getClauses().forEach(item -> extractNodeKeys(item, keys));
        }
    }
}
