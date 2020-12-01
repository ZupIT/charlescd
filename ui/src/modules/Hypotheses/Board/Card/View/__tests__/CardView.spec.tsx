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
import userEvent from '@testing-library/user-event';
import { act, render, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import CardView from '..'
import { Card } from 'modules/Hypotheses/Board/interfaces';
import {
  CARD_TYPE_ACTION,
  CARD_TYPE_FEATURE
} from 'modules/Hypotheses/Board/Card/constants';

const props = {
  id: '123',
  onClose: jest.fn()
}

const card: Omit<Card, 'type' | 'feature'> = {
  id: '123',
  hypothesisId: '098',
  name: 'Card',
  createdAt: '2020-01-01 12:00',
  labels: [],
  index: 0,
  isProtected: false
}

const cardFeature: Card = {
  ...card,
  type: CARD_TYPE_FEATURE,
  feature: {
    id: '456',
    name: 'feature',
    branches: ['https://github.com/charlescd/tree/feature'],
    branchName: 'feature',
    author: {
      id: '123',
      name: 'Charles',
      email: 'charlescd@zup.com.br',
      isRoot: false,
      createdAt: '2020-01-01 12:00'
    },
    modules: [{
      id: '789',
      name: 'ZupIT/charlescd',
      gitRepositoryAddress: '',
      helmRepository: ''
    }]
  }
}

const cardAction: Omit<Card, 'feature'> = {
  ...card,
  type: CARD_TYPE_ACTION,
}

const modules = {
  content: [
    {
      id: "123",
      name: "ZupIT",
      gitRepositoryAddress: "https://github.com/ZupIT/",
      helmRepository: "https://api.github.com/",
      createdAt: "2020-10-01 12:00:01",
      components: [
        {
          id: "123",
          name: "zup",
          createdAt: "2020-10-01 12:00:01",
          errorThreshold: 10,
          latencyThreshold: 10000,
          hostValue: "",
          gatewayName: ""
        }
      ]
    }
  ]
}

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render CardView type.ACTION', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify(cardAction));

  render(<CardView {...props} />);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();

  const CardViewContent = await screen.findByTestId(`card-view-${props.id}-content`);
  expect(CardViewContent).toBeInTheDocument();
});

test('render CardView type.FEATURE', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify(cardFeature));

  render(<CardView {...props} />);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();

  const CardViewContent = await screen.findByTestId(`card-view-${props.id}-content`);
  expect(CardViewContent).toBeInTheDocument();
  
  const Module = await screen.findByTestId('input-group-feature-prepend');
  expect(Module).toBeInTheDocument();
});

test('render CardView type.FEATURE and try to add a module', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(cardFeature));
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(modules));

  render(<CardView {...props} />);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();

  const AddButtons = await screen.findAllByTestId('button-iconRounded-plus-circle');
  expect(AddButtons.length).toBe(2);
  
  await act(async () => userEvent.click(AddButtons[1]));

  const SaveModulesButton = await screen.findByTestId('button-default-save-modules');
  expect(SaveModulesButton).toBeInTheDocument();

  const InputBranchName = await screen.findByTestId('input-text-branchName');
  expect(InputBranchName).toBeInTheDocument();

  userEvent.type(InputBranchName, 'branch-charlescd');
  act(() => userEvent.click(SaveModulesButton));

  waitFor(() => expect(props.onClose).toBeCalled());
});

test('render CardView type.ACTION and try to add a module', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(cardAction));
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(modules));

  let SaveModulesButton;
  let InputBranchName;

  render(<CardView {...props} />);

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();

  const AddButtons = await screen.findAllByTestId('button-iconRounded-plus-circle');
  expect(AddButtons.length).toBe(2);
  
  await act(async () => userEvent.click(AddButtons[1]));

  SaveModulesButton = await screen.findByTestId('button-default-save-modules');
  expect(SaveModulesButton).toBeInTheDocument();
  expect(SaveModulesButton).not.toBeDisabled();

  InputBranchName = screen.queryByTestId('input-text-branchName');
  expect(InputBranchName).not.toBeInTheDocument();

  const AddIcons = await screen.findAllByTestId('icon-plus-circle');
  expect(AddIcons.length).toBe(3);

  await act(async () => userEvent.click(AddIcons[2]));

  InputBranchName = await screen.findByTestId('input-text-branchName');
  expect(InputBranchName).toBeInTheDocument();

  SaveModulesButton = screen.queryByTestId('button-default-save-modules');
  expect(SaveModulesButton).toBeDisabled();
});
