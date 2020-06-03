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

import { getVariationStatus } from '../helpers'
import { GROWING_STATUS } from '../enums';

test('should check variation statuses', () => {
  expect(getVariationStatus(undefined, 10)).toEqual(GROWING_STATUS.NORMAL)
  expect(getVariationStatus(10, 15)).toEqual(GROWING_STATUS.UP)
  expect(getVariationStatus(10, 8)).toEqual(GROWING_STATUS.DOWN)
  expect(getVariationStatus(10, 10)).toEqual(GROWING_STATUS.NORMAL)
});
