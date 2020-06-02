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
  COLOR_GHOST_WHITE,
  COLOR_LIGHT_DEFAULT,
  COLOR_FREE_SPEECH_BLUE,
  COLOR_PURPLE_HEART,
  COLOR_SANTAS_GREY,
  COLOR_BLACK_OP_20
} from 'core/assets/colors';

export const light = {};

export const dark = {
  createCard: COLOR_BLACK_MARLIN,
  button: {
    color: COLOR_LIGHT_DEFAULT,
    background: COLOR_PURPLE_HEART,
    action: {
      color: COLOR_LIGHT_DEFAULT,
      background: COLOR_FREE_SPEECH_BLUE,
      shadow: COLOR_BLACK_OP_20
    }
  },
  module: {
    border: COLOR_SANTAS_GREY
  },
  member: {
    border: COLOR_SANTAS_GREY,
    ellipsis: {
      background: COLOR_BLACK_MARLIN
    }
  },
  tip: {
    color: COLOR_LIGHT_DEFAULT,
    background: COLOR_BLACK_MARLIN
  },
  header: {
    border: COLOR_GHOST_WHITE
  }
};
