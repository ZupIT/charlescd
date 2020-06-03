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
  COLOR_BLACK_MARLIN,
  COLOR_FREE_SPEECH_BLUE,
  COLOR_LIGHT_DEFAULT,
  COLOR_BLACK_RUSSIAN,
  COLOR_LAVENDER_GREY
} from 'core/assets/colors';

export const light = {};

export const dark = {
  ACTION: {
    action: COLOR_BLACK_MARLIN,
    background: COLOR_BLACK_MARLIN
  },
  FEATURE: {
    action: COLOR_LIGHT_DEFAULT,
    background: COLOR_FREE_SPEECH_BLUE
  },
  selectable: {
    background: COLOR_BLACK_RUSSIAN,
    border: COLOR_LAVENDER_GREY
  }
};
