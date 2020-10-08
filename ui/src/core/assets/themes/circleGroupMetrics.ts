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
  COLOR_BLACK_MARLIN,
  COLOR_RED_ORANGE,
  COLOR_ORANGE_PEEL,
  COLOR_SANTAS_GREY,
  COLOR_PAYNES_GREY,
  COLOR_MOUNTAIN_MEADOW,
  COLOR_FREE_SPEECH_BLUE,
  COLOR_NEON_BLUE
} from '../colors';

export const light = {};

export const dark = {
  content: {
    background: COLOR_BASTILLE,
    card: COLOR_BLACK_MARLIN
  },
  execution: {
    status: {
      error: COLOR_RED_ORANGE,
      reached: COLOR_ORANGE_PEEL,
      active: COLOR_SANTAS_GREY
    }
  },
  action: {
    status: {
      success: COLOR_MOUNTAIN_MEADOW,
      failed: COLOR_RED_ORANGE,
      inExecution: COLOR_FREE_SPEECH_BLUE,
      notExecuted: COLOR_NEON_BLUE
    }
  },
  chart: {
    gridColor: COLOR_BLACK_MARLIN
  },
  footer: {
    borderColor: COLOR_PAYNES_GREY
  }
};
