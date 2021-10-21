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
  COLOR_PURPLE_HEART,
  COLOR_WHITE,
  COLOR_BLACK_MARLIN,
  COLOR_SANTAS_GREY
} from 'core/assets/colors';

export const light = {};

export const dark = {
  background: COLOR_PURPLE_HEART,
  color: COLOR_WHITE,
  outline: {
    border: COLOR_SANTAS_GREY,
    color: COLOR_SANTAS_GREY
  },
  disabled: {
    color: COLOR_SANTAS_GREY,
    background: COLOR_BLACK_MARLIN
  }
};
