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
// @ts-nocheck


import { getCookieOptions } from '../domain';

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    href: '',
    pathname: '',
    hostname: 'charles.hostname'
  };
});

afterEach(() => {
  Object.assign(window, originalWindow);
})


test("should get current hostname", () => {
  const options = getCookieOptions();

  expect(options.domain).toBe('charles.hostname');
});
