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

import { UserChecked } from '../../../interfaces/UserChecked';

export const users = [
  {
    id: 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f',
    name: 'User 2',
    email: 'user.2@zup.com.br',
    photoUrl:
      'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
    checked: true
  },
  {
    id: '13ea193b-f9d2-4wed-b1ce-471a7ae871c2',
    name: 'User 3',
    email: 'user.3@zup.com.br',
    photoUrl: '',
    checked: true
  },
  {
    id: '8b81e7a7-33f1-46cb-aedf-73222bf8769f',
    name: 'User 4',
    email: 'user.4@zup.com.br',
    photoUrl: '',
    checked: true
  }
];

export const emptyUsers: UserChecked[] = [];
