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

package io.charlescd.circlematcher.domain.service.impl;

import io.charlescd.circlematcher.domain.service.RandomService;
import java.security.SecureRandom;
import org.springframework.stereotype.Service;

@Service
public class RandomServiceImpl implements RandomService {

    private SecureRandom secureRandom;

    public RandomServiceImpl() {
        this.secureRandom = new SecureRandom();
    }

    public int getRandomNumber(int number) {
        return this.secureRandom.nextInt(number) + 1;
    }

}
