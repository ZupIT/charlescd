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
  COLOR_DODGER_BLUE,
  COLOR_MOUNTAIN_MEADOW,
  COLOR_VIOLET_BLUE,
  COLOR_ORANGE_PEEL,
  COLOR_RADICAL_RED,
  COLOR_SUMMER_SKY,
  COLOR_RED_ORANGE,
  COLOR_MAYA_BLUE,
  COLOR_GOLD,
  COLOR_CHRISTI,
  COLOR_MALACHITE,
  COLOR_BLACK_MARLIN,
  COLOR_SANTAS_GREY,
  COLOR_PAYNES_GREY,
  COLOR_BASTILLE,
  COLOR_FREE_SPEECH_BLUE,
  COLOR_WHITE,
  COLOR_PURPLE_HEART
} from 'core/assets/colors';

export const light = {};

export const dark = {
  chart: {
    Comparison: [
      COLOR_DODGER_BLUE,
      COLOR_MOUNTAIN_MEADOW,
      COLOR_VIOLET_BLUE,
      COLOR_ORANGE_PEEL,
      COLOR_RADICAL_RED,
      COLOR_SUMMER_SKY,
      COLOR_RED_ORANGE,
      COLOR_MAYA_BLUE,
      COLOR_GOLD,
      COLOR_CHRISTI
    ],
    error: COLOR_RED_ORANGE,
    latency: COLOR_GOLD,
    requestCircle: COLOR_MALACHITE
  },
  provider: {
    success: COLOR_MALACHITE,
    error: COLOR_RED_ORANGE
  },
  health: {
    cardBackground: COLOR_BLACK_MARLIN,
    cardModules: COLOR_PAYNES_GREY,
    variation: {
      danger: COLOR_RED_ORANGE,
      warning: COLOR_GOLD,
      ok: COLOR_SANTAS_GREY,
      success: COLOR_MALACHITE
    }
  },
  dashboard: {
    card: COLOR_BASTILLE,
    chart: {
      averageTime: COLOR_MAYA_BLUE,
      deploy: COLOR_MOUNTAIN_MEADOW,
      error: COLOR_RED_ORANGE,
      labels: COLOR_WHITE,
      border: COLOR_PAYNES_GREY
    }
  },
  circles: {
    filter: COLOR_BLACK_MARLIN,
    active: COLOR_FREE_SPEECH_BLUE,
    inactive: COLOR_MAYA_BLUE,
    deployed: COLOR_MOUNTAIN_MEADOW,
    deploying: COLOR_DODGER_BLUE,
    error: COLOR_RED_ORANGE,
    undeploying: COLOR_FREE_SPEECH_BLUE,
    notDeployed: COLOR_PURPLE_HEART,
    history: {
      circleRow: {
        background: COLOR_BLACK_MARLIN
      },
      releaseRow: {
        background: COLOR_PAYNES_GREY
      },
      componentRow: {
        background: COLOR_BLACK_MARLIN
      }
    }
  },
  deploy: {
    deployed: COLOR_MOUNTAIN_MEADOW,
    deploying: COLOR_DODGER_BLUE,
    error: COLOR_RED_ORANGE,
    undeploying: COLOR_FREE_SPEECH_BLUE,
    notDeployed: COLOR_PURPLE_HEART,
    release: {
      releaseRow: {
        background: COLOR_BLACK_MARLIN
      },
      componentRow: {
        background: COLOR_PAYNES_GREY
      }
    }
  }
};
