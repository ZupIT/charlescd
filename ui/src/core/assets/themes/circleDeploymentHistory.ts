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
  COLOR_BASTILLE,
  COLOR_MOUNTAIN_MEADOW,
  COLOR_DODGER_BLUE,
  COLOR_RED_ORANGE,
  COLOR_PURPLE_HEART,
  COLOR_BLACK_MARLIN,
  COLOR_ORANGE_PEEL
} from '../colors';

export const light = {};

export const dark = {
  content: {
    table: COLOR_BASTILLE,
    release: COLOR_BLACK_MARLIN
  },
  execution: {
    deployed: COLOR_MOUNTAIN_MEADOW,
    deploying: COLOR_DODGER_BLUE,
    error: COLOR_RED_ORANGE,
    failed: COLOR_RED_ORANGE,
    undeploying: COLOR_ORANGE_PEEL,
    notDeployed: COLOR_PURPLE_HEART,
  } as Record<string, string>
};