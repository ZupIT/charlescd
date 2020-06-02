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

import * as metricHelpers from '../helpers';

test('toList | convert data to chart series', () => {
  const expected = [[1583692711113, 30], [1583692712113, 25]];
  const data = [
    { value: 30, timestamp: 1583692711113 },
    { value: 25, timestamp: 1583692712113 }
  ];

  expect(metricHelpers.toList(data)).toMatchObject(expected);
});
