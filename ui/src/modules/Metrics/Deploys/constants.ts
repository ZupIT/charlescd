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

import { PERIOD_PARAM } from './interfaces';

export const periodFilterItems = [
  {
    label: 'One week',
    value: PERIOD_PARAM.ONE_WEEK
  },
  {
    label: 'Two weeks',
    value: PERIOD_PARAM.TWO_WEEKS
  },
  {
    label: 'One month',
    value: PERIOD_PARAM.ONE_MONTH
  },
  {
    label: 'Three monts',
    value: PERIOD_PARAM.THREE_MONTHS
  }
];
