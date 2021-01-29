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

export const DEFAULT_MAX_LENGTH = 100;

export const checkPoints = [
  {
    name: 'Uppercase',
    rule: (pass = '') => new RegExp(/[A-Z]/).test(pass),
    message: 'Must have at least one uppercase character'
  },
  {
    name: 'Lowercase',
    rule: (pass = '') => new RegExp(/[a-z]/).test(pass),
    message: 'Must have at least one lowercase character'
  },
  {
    name: 'Numbers',
    rule: (pass = '') => new RegExp(/[0-9]/).test(pass),
    message: 'Must have at least one number'
  },
  {
    name: 'Special Character',
    rule: (pass = '') => new RegExp(/[!@#$%^&*(),.?":{}|<>]/).test(pass),
    message: 'Must have at least one special character'
  },
  {
    name: 'Minimum 10 and max of 100 characters',
    rule: (pass = '') =>
      pass?.length >= 10 && pass?.length <= DEFAULT_MAX_LENGTH,
    message: 'Must be between 10 and 100 characters'
  },
  {
    name: 'Confirm password',
    rule: (pass = '', confirm = '') => pass !== '' && pass === confirm,
    message: 'Passwords do not match'
  }
];
