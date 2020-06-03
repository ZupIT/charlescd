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
  COLOR_LIGHT_DEFAULT,
  COLOR_BLACK_RUSSIAN,
  COLOR_NEON_BLUE,
  COLOR_BASTILLE,
  COLOR_WHITE,
  COLOR_BLACK_MARLIN,
  COLOR_SANTAS_GREY
} from '../colors';

export const light = {};

export const dark = {
  background: COLOR_BLACK_RUSSIAN,
  color: COLOR_LIGHT_DEFAULT,
  placeholder: COLOR_SANTAS_GREY,
  borderColor: COLOR_WHITE,
  disabled: {
    color: COLOR_SANTAS_GREY,
    borderColor: COLOR_SANTAS_GREY
  },
  focus: {
    color: COLOR_LIGHT_DEFAULT,
    borderColor: COLOR_NEON_BLUE
  },
  menu: {
    background: COLOR_BASTILLE,
    color: COLOR_SANTAS_GREY,
    border: COLOR_BASTILLE,
    hover: {
      background: COLOR_BLACK_MARLIN
    }
  }
};
