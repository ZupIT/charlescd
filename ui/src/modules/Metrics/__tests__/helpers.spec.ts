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

import { timestampFormater } from '../helpers';

test('should return time formated correctly', async () => {
  expect(timestampFormater(53)).toEqual('53s');
  expect(timestampFormater(72)).toEqual('1:12m');
  expect(timestampFormater(4365)).toEqual('1:12:45h');
  expect(timestampFormater(0)).toEqual(0);
})
