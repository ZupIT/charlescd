/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain.service;

import br.com.zup.darwin.circle.matcher.domain.Circle;

import java.util.Map;
import java.util.Set;

public interface IdentificationService {

    Set<Circle> identify(Map<String, Object> request);

}
