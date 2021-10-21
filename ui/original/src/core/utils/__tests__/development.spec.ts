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

import { isDevelopmentLegacyHost, hostLegacyDevelopment } from '../development';

test('is development host legacy', () => {
  expect(isDevelopmentLegacyHost()).toEqual(hostLegacyDevelopment);
});

test('is not development host legacy', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'production' });
  const { protocol } = window.location
  expect(isDevelopmentLegacyHost()).toEqual(`${protocol}//localhost`);
  process.env = Object.assign(process.env, { NODE_ENV: 'test' });
  expect(isDevelopmentLegacyHost()).toEqual(`http://localhost:3001`);
});
