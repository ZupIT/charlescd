/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.api.misc;

import br.com.zup.charlescd.villager.infrastructure.filter.RequestContext;
import br.com.zup.charlescd.villager.util.Constants;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;

@Provider
public class ApplicationIdValidationFilter implements ContainerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(ApplicationIdValidationFilter.class);

    @Override
    public void filter(ContainerRequestContext reqContext) {
        String contentType = reqContext.getHeaders().getFirst(Constants.X_APPLICATION_ID);

        if (StringUtils.isEmpty(contentType)) {
            var msg = "Header x-application-id is required!";
            LOGGER.error(RequestContext.getTag(), msg);
            throw new IllegalArgumentException(msg);
        }
    }

}