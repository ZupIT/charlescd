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

package io.charlescd.villager.api.misc;

import io.charlescd.villager.infrastructure.filter.RequestContext;
import io.charlescd.villager.util.Constants;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Provider
public class WorkspaceIdValidationFilter implements ContainerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkspaceIdValidationFilter.class);

    @Override
    public void filter(ContainerRequestContext reqContext) {
        String contentType = reqContext.getHeaders().getFirst(Constants.X_WORKSPACE_ID);

        if (StringUtils.isEmpty(contentType)) {
            var msg = "Header x-workspace-id is required!";
            LOGGER.error(RequestContext.getTag(), msg);
            throw new IllegalArgumentException(msg);
        }
    }

}
