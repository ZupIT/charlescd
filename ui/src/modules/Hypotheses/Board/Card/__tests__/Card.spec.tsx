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
import { act } from 'react-dom/test-utils';
import { FetchMock } from 'jest-fetch-mock';
import { dark as cardBoardTheme } from 'core/assets/themes/card/board';
import CardBoard from '..'
import userEvent from '@testing-library/user-event';
import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { Card } from '../../interfaces'
import { CARD_TYPE_ACTION, CARD_TYPE_FEATURE } from '../constants'
import { Props as CardBoardProps } from '..'

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

test('render Card type.FEATURE and open view', async () => {
  render(<CardBoard {...propsFeature} />);

  const Card = await screen.findByTestId(`card-board-${propsFeature.card.id}`);
  expect(Card).toBeInTheDocument();

  await act(async () => userEvent.click(Card));

  const ModalView = await screen.findByTestId("modal-default");
  expect(ModalView).toBeInTheDocument();
});

test('render Card type.ACTION and open view', async () => {
  render(<CardBoard {...propsAction} />);

  let ModalView;

  const Card = await screen.findByTestId(`card-board-${propsAction.card.id}`);
  expect(Card).toBeInTheDocument();

  await act(async () => userEvent.click(Card));

  ModalView = await screen.findByTestId("modal-default");
  expect(ModalView).toBeInTheDocument();

  const CloseIcon = await screen.findByTestId('icon-cancel');
  expect(CloseIcon).toBeInTheDocument();
  
  await act(async () => userEvent.click(CloseIcon));

  ModalView = screen.queryByTestId("modal-default");
  expect(ModalView).not.toBeInTheDocument();
});

test('render Card type.ACTION and open view and close', async () => {
  render(<CardBoard {...propsAction} />);

  const Card = await screen.findByTestId(`card-board-${propsAction.card.id}`);
  expect(Card).toBeInTheDocument();

  await act(async () => userEvent.click(Card));

  const ModalView = await screen.findByTestId("modal-default");
  expect(ModalView).toBeInTheDocument();
});

test('render Card type.ACTION and open dropdown options', async () => {
  render(<CardBoard {...propsAction} />);

  const Card = await screen.findByTestId(`card-board-${propsAction.card.id}`);
  expect(Card).toBeInTheDocument();

  const DropdownTrigger = await screen.findByTestId("icon-vertical-dots");
  await act(async () => userEvent.click(DropdownTrigger));

  const DropdownOptions = await screen.findByTestId("dropdown-actions");
  expect(DropdownOptions).toBeInTheDocument();
});

test('render Card type.FEATURE and open modal to delete card', async () => {
  render(<CardBoard {...propsFeature} />);

  const Card = await screen.findByTestId(`card-board-${propsFeature.card.id}`);
  expect(Card).toBeInTheDocument();

  const DropdownTrigger = await screen.findByTestId("icon-vertical-dots");
  await act(async () => userEvent.click(DropdownTrigger));

  const DropdownOptions = await screen.findByTestId("dropdown-actions");
  expect(DropdownOptions).toBeInTheDocument();

  const DeleteAction = await screen.findByTestId("dropdown-item-delete-Delete");
  await act(async () => userEvent.click(DeleteAction));

  const Modal = await screen.findByText("Choose what you want to delete");
  expect(Modal).toBeInTheDocument();
});