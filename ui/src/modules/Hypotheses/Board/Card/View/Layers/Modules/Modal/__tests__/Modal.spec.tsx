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
import { render, screen } from 'unit-test/testUtils';
import { CardType } from 'modules/Hypotheses/Board/interfaces';
import Modal from '..';

const props = {
  card: {
    id: '123',
    name: 'card',
    createdAt: '2020-01-01 12:00',
    labels: [''],
    type: 'FEATURE' as CardType,
    hypothesisId: '123',
    feature: {
      id: '123',
      name: 'feature',
      branchName: 'feature/branch',
      modules: [{
        id: '123',
        name: 'module',
        gitRepositoryAddress: '',
        helmRepository: ''
      }]
    },
    index: 1
  },
  onClose: jest.fn(),
  modules: [{
    id: '123',
    name: 'module',
    gitRepositoryAddress: '',
    helmRepository: ''
  }],
  allModules: [{
    id: '123',
    name: 'module',
    gitRepositoryAddress: '',
    helmRepository: ''
  }]
}

test('render Modal default component', async () => {
   render(
    <Modal {...props}  />
  );

  expect(screen.getByTestId("modal-default")).toBeInTheDocument();
});
