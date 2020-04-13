/*
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
 * with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package br.com.zup.charlescd.villager.infrastructure.aspect;

import br.com.zup.charlescd.villager.infrastructure.filter.RequestContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
public class InteractorAspect {

    private static final Logger LOGGER = LoggerFactory.getLogger(InteractorAspect.class);

    @AfterThrowing(pointcut = "execution(* br.com.zup.darwin.villager.interactor..*.*(..))", throwing = "ex")
    public void afterThrowing(Exception ex) throws JsonProcessingException {

        LOGGER.error(RequestContext.getTag(), new ObjectMapper().writeValueAsString(ex));

        throw new RuntimeException(ex.getMessage(), ex);
    }

}
