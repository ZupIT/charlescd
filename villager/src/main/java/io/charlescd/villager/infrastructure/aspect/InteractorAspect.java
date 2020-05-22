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

package io.charlescd.villager.infrastructure.aspect;

import io.charlescd.villager.infrastructure.filter.RequestContext;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
public class InteractorAspect {

    private static final Logger LOGGER = LoggerFactory.getLogger(InteractorAspect.class);

    @AfterThrowing(pointcut = "execution(* io.charlescd..villager.interactor..*.*(..))", throwing = "ex")
    public void afterThrowing(Exception ex) throws JsonProcessingException {

        LOGGER.error(RequestContext.getTag(), new ObjectMapper().writeValueAsString(ex));

        throw new RuntimeException(ex.getMessage(), ex);
    }

}
