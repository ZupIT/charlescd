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
import { act, render, screen } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { dark as cardBoardTheme } from 'core/assets/themes/card/board';
import { Card } from '../../interfaces';
import { CARD_TYPE_ACTION, CARD_TYPE_FEATURE } from '../constants';
import CardBoard, { Props as CardBoardProps } from '..'
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps
} from 'react-beautiful-dnd';

const card: Omit<Card, 'type' | 'feature'> = {
  id: '123',
  hypothesisId: '098',
  name: 'Card',
  createdAt: '2020-01-01 12:00',
  labels: [],
  index: 0,
  isProtected: false
}

const cardAction: Card = {
  ...card,
  feature: null,
  type: CARD_TYPE_ACTION,
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

const draggableProps: DraggableProvidedDraggableProps = {
  "data-rbd-draggable-context-id": "0",
  "data-rbd-draggable-id": "123",
  onTransitionEnd: null,
  style: {
    transform: null,
    transition: null
  },
}

const dragHandleProps: DraggableProvidedDragHandleProps = {
  "aria-labelledby": "",
  "data-rbd-drag-handle-context-id": "0",
  "data-rbd-drag-handle-draggable-id": "123",
  draggable: false,
  onDragStart: jest.fn(),
  tabIndex: 0
}

const propsFeature: CardBoardProps = {
  card: cardFeature,
  columnId: '123',
  draggableProps,
  dragHandleProps
}

const propsAction: CardBoardProps = {
  card: cardAction,
  columnId: '123',
  draggableProps,
  dragHandleProps
}

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render Card type.FEATURE', async () => {
  render(<CardBoard {...propsFeature} />);

  const Card = await screen.findByTestId(`card-board-${propsFeature.card.id}`);
  expect(Card).toBeInTheDocument();
  expect(Card).toHaveStyle(`background-color: ${cardBoardTheme.FEATURE.background};`);
});

test('render Card type.ACTION', async () => {
  render(<CardBoard {...propsAction} />);

  const Card = await screen.findByTestId(`card-board-${propsAction.card.id}`);
  expect(Card).toBeInTheDocument();
  expect(Card).toHaveStyle(`background-color: ${cardBoardTheme.ACTION.background};`);
});
