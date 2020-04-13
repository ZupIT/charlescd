/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

package br.com.zup.darwin.circle.matcher.domain.service;

import br.com.zup.darwin.circle.matcher.api.request.CreateSegmentationRequest;
import br.com.zup.darwin.circle.matcher.api.request.UpdateSegmentationRequest;

public interface SegmentationService {

    void create(CreateSegmentationRequest request);

    void update(UpdateSegmentationRequest updateSegmentationRequest);

    void remove(String reference);
}
