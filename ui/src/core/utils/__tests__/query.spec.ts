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

import { buildParams } from "../query";

test("should build query params dynammicaly", () => {
  const params = {
    foo: 'bar',
    ids: [1,2],
    names: ['jhon', 'doe'],
    age: 9
  };

  const urlParams = buildParams(params);
  const expected = 'foo=bar&ids=1&ids=2&names=jhon&names=doe&age=9';
  
  expect(urlParams.toString()).toEqual(expected);
});
