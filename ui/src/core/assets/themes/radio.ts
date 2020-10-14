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
  COLOR_SANTAS_GREY,
  COLOR_BASTILLE,
  COLOR_PURPLE_HEART,
  COLOR_WHITE,
  COLOR_CHETWODE_BLUE,
  COLOR_JAGUAR
} from 'core/assets/colors';

export const light = {};

export const dark = {
  button: {
    checked: {
      background: COLOR_PURPLE_HEART,
      color: COLOR_WHITE
    },
    unchecked: {
      background: COLOR_BASTILLE,
      color: COLOR_SANTAS_GREY
    }
  },
  card: {
    checked: {
      background: COLOR_JAGUAR,
      border: COLOR_CHETWODE_BLUE,
      color: COLOR_WHITE,
      checkmark: COLOR_CHETWODE_BLUE
    },
    unchecked: {
      background: COLOR_BASTILLE,
      border: COLOR_BASTILLE,
      color: COLOR_SANTAS_GREY,
      checkmark: COLOR_SANTAS_GREY
    }
  }
};
