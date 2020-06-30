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
  COLOR_BASTILLE
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
    card: COLOR_BASTILLE
  }
};
