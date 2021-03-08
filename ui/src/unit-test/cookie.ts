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

import { CustomGlobal } from 'setupTests';

export const mockCookie = () => {
  jest.mock('react-cookies', () => ({
    save: (key: string, value: string) => {
      (global as unknown as CustomGlobal).document.cookie = `${key}=${value};`;
    },
    load: jest
      .fn()
      .mockImplementation(() => (global as unknown as CustomGlobal).document.cookie)
  }));
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=1; expires=1 Jan 1970 00:00:00 GMT;`
}
