/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure;

import br.com.zup.darwin.circle.matcher.domain.Node;
import br.com.zup.darwin.circle.matcher.domain.Segmentation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class SegmentationKeyUtils {

    private SegmentationKeyUtils() {
    }

    public static String extract(String key) {
        return key.split(Constants.KEY_COMPONENTS_DELIMITER)[0];
    }

    public static String generate(Segmentation segmentation) {
        var extractedKeys = new HashSet<String>();

        if (segmentation.getNode() != null) {
            extractNodeKeys(segmentation.getNode(), extractedKeys);
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
