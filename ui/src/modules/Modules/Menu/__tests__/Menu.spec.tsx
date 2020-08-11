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

import React from 'react';
import { render } from 'unit-test/testUtils';
import Menu from '../index';

const mockItem = [
  {
    id: '4d1cf7a9-d2f5-43b0-852e-e1b583b71c58',
    name: 'Module 1',
    gitRepositoryAddress: 'git-address-2',
    helmRepository: 'helm-repository-1',
    createdAt: '2019-09-13 21:22:05',
    author: {
      id: 'c7e6dete-aa7a-4216-be1b-34eacd4c2915',
      name: 'User 1',
      email: 'user.1@zup.com.br',
      photoUrl:
        'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png'
    },
    components: [
      {
        id: '89f59qf1-5cea-1c24-ac2f-fe719cdasd8f',
        name: 'Module Component 1',
        latencyThreshold: '4.2',
        errorThreshold: '0.6'
      }
    ]
  }
];

test('render Modules Menu', () => {
  const { getByText } = render(
    <Menu items={mockItem} isLoading={false} />
  );

  const moduleName = getByText('Module 1');

  expect(moduleName).toBeInTheDocument();
});

test('render Modules Menu on Loading', () => {
  const { getByText } = render(<Menu items={mockItem} isLoading />);

  const loading = getByText('Loading...');

  expect(loading).toBeInTheDocument();
});
