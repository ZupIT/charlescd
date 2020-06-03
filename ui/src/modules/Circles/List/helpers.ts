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

import filter from 'lodash/filter';
import find from 'lodash/find';
import { DEFAULT_CIRCLE_NAME } from '../constants';
import { CirclePaginationItem } from '../interfaces/CirclesPagination';

export const prepareCircles = (circles: CirclePaginationItem[]) => [
  ...filter(circles, item => item.name !== DEFAULT_CIRCLE_NAME)
];

export const getDefaultCircle = (circles: CirclePaginationItem[]) =>
  find(circles, item => item.name === DEFAULT_CIRCLE_NAME);
