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

import { PROJECTION_TYPE } from './enums';

export const PERIODS = [
  {
    type: PROJECTION_TYPE.FIVE_MINUTES,
    value: 5,
    label: 'm'
  },
  {
    type: PROJECTION_TYPE.THIRTY_MINUTES,
    value: 30,
    label: 'm'
  },
  {
    type: PROJECTION_TYPE.ONE_HOUR,
    value: 1,
    label: 'h'
  },
  {
    type: PROJECTION_TYPE.THREE_HOUR,
    value: 3,
    label: 'h'
  },
  {
    type: PROJECTION_TYPE.EIGHT_HOUR,
    value: 8,
    label: 'h'
  }
];
