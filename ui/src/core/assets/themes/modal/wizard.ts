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
  COLOR_LIGHT_DEFAULT,
  COLOR_BLACK_RUSSIAN,
  COLOR_MOUNTAIN_MEADOW,
  COLOR_MAYA_BLUE,
  COLOR_OBSERVATORY,
  COLOR_GOLD,
  COLOR_RADICAL_RED,
  COLOR_PURPLE_HEART,
  COLOR_ORANGE_PEEL,
  COLOR_SANTAS_GREY
} from 'core/assets/colors';

export const light = {};

export const dark = {
  screen: COLOR_BLACK_RUSSIAN,
  background: {
    menu: COLOR_BASTILLE,
    info: COLOR_BLACK_MARLIN,
    welcome: COLOR_MAYA_BLUE,
    userGroup: COLOR_OBSERVATORY,
    git: COLOR_GOLD,
    registry: COLOR_RADICAL_RED,
    cdConfig: COLOR_PURPLE_HEART,
    circleMatcher: COLOR_ORANGE_PEEL,
    metricsProvider: COLOR_MOUNTAIN_MEADOW
  },
  button: COLOR_PURPLE_HEART,
  text: {
    active: COLOR_LIGHT_DEFAULT,
    inactive: COLOR_SANTAS_GREY
  }
};
