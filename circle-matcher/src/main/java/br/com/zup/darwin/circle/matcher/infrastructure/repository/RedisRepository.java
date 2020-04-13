/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.infrastructure.repository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.Cursor;

import java.io.IOException;

public interface RedisRepository {

    Logger logger = LoggerFactory.getLogger(RedisRepository.class);

    default void closeCursor(Cursor cursor) {
        if (!cursor.isClosed()) {
            try {
                cursor.close();
            } catch (IOException ex) {
                logger.error("Error closing the cursor", ex);
            }
        }
    }

}
