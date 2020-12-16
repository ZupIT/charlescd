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
import { FetchMock } from 'jest-fetch-mock';
import CardRemove from '..'
import { Card } from 'modules/Hypotheses/Board/interfaces';
import {
  CARD_TYPE_ACTION,
  CARD_TYPE_FEATURE
} from 'modules/Hypotheses/Board/Card/constants';

const props = {
  id: '123',
  onClose: jest.fn(),
  onRemove: jest.fn()
}

test('render CardRemove', async () => {
  render(<CardRemove {...props} />);

  expect(screen.getByTestId('modal-trigger')).toBeInTheDocument();

  const RadioCards = await screen.findByTestId(`radio-cards-remove-${props.id}`);
  expect(RadioCards).toBeInTheDocument();

  const RadioItemCard = await screen.findByTestId(`radio-cards-remove-${props.id}-item-card`);
  expect(RadioItemCard).toBeInTheDocument();

  const RadioItemCardBranch = await screen.findByTestId(`radio-cards-remove-${props.id}-item-card-branch`);
  expect(RadioItemCardBranch).toBeInTheDocument();
  expect(RadioItemCardBranch).not.toHaveAttribute('disabled');
});

test('render CardRemove protected', async () => {
  render(<CardRemove {...props} isProtected={true} />);

  expect(screen.getByTestId('modal-trigger')).toBeInTheDocument();

  const RadioCards = await screen.findByTestId(`radio-cards-remove-${props.id}`);
  expect(RadioCards).toBeInTheDocument();

  const RadioItemCard = await screen.findByTestId(`radio-cards-remove-${props.id}-item-card`);
  expect(RadioItemCard).toBeInTheDocument();

  const RadioItemCardBranch = await screen.findByTestId(`radio-cards-remove-${props.id}-item-card-branch`);
  expect(RadioItemCardBranch).toBeInTheDocument();
  expect(RadioItemCardBranch).toHaveAttribute('disabled');
});