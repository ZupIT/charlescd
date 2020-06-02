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

import {
  COLOR_MOUNTAIN_MEADOW,
  COLOR_PURPLE_HEART,
  COLOR_RED_ORANGE,
  COLOR_FREE_SPEECH_BLUE
} from 'core/assets/colors';

export const light = {};

export const dark = {
  background: {
    DEPLOYED: COLOR_MOUNTAIN_MEADOW,
    DEPLOYING: COLOR_MOUNTAIN_MEADOW,
    UNDEPLOYING: COLOR_FREE_SPEECH_BLUE,
    BUILT: COLOR_PURPLE_HEART,
    BUILDING: COLOR_PURPLE_HEART,
    BUILD_FAILED: COLOR_RED_ORANGE
  }
};
