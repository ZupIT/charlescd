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

import map from 'lodash/map';
import get from 'lodash/get';
import find from 'lodash/find';
import { getProfile } from 'core/utils/profile';
import { DropResult, DraggableLocation } from 'react-beautiful-dnd';
import { Card } from './interfaces';
import { Column as Props, CreateCardParams } from './interfaces';
import { ADD_INDEX, REMOVE_INDEX, CARDS_LIST } from './constants';
import { COLUMN } from './Column/constants';

export const getColumn = (columns: Props[], columnName: string) =>
  find(columns, ['name', columnName]);

const removeItem = (list: Card[], sourceIndex: number) => {
  list.splice(sourceIndex, REMOVE_INDEX);
};

const addItem = (list: Card[], destinationIndex: number, targetItem: Card) => {
  list.splice(destinationIndex, ADD_INDEX, targetItem);
};

const prepareColumns = (result: DropResult, columns: Props[]) => {
  const { destination, source } = result;
  const { droppableId: sourceId, index: sourceIndex } = source;
  const { droppableId: destinationId, index: destinationIndex } = destination;
  const targetColumn = find(columns, column => column.id === sourceId);
  const targetItem = get(targetColumn, CARDS_LIST)[sourceIndex];

  const columnClone = map(columns, column => {
    const { id } = column;

    if (id === sourceId) {
      removeItem(column[CARDS_LIST], sourceIndex);
    }

    if (id === destinationId) {
      addItem(column[CARDS_LIST], destinationIndex, targetItem);
    }

    return column;
  });

  return columnClone;
};

export function reorder(result: DropResult, columns: Props[]) {
  const { destination, source } = result;

  return destination && source ? prepareColumns(result, columns) : columns;
}

export const reorderCards = (result: DropResult, columns: Props[]) =>
  reorder(result, columns);

const order = (
  destinationId: string,
  columns: Props[],
  hypothesisId: string,
  reorderColumn: Function
) => {
  const column = find(columns, ({ id }) => id === destinationId);

  reorderColumn(hypothesisId, column);
};

const move = (
  sourceId: string,
  destinationId: string,
  columns: Props[],
  cardId: string,
  hypothesisId: string,
  movingCard: Function
) => {
  const source = find(columns, ({ id }) => id === sourceId);
  const destination = find(columns, ({ id }) => id === destinationId);
  const data = {
    source,
    destination
  };

  movingCard(hypothesisId, cardId, data);
};

export const isAllowedToMove = (
  columns: Props[],
  cardId: string,
  destination: DraggableLocation,
  source: DraggableLocation
) => {
  const { droppableId: destinationId } = destination;
  const { droppableId: sourceId } = source;
  const sourceColumn = find(columns, column => column.id === sourceId);
  const destinationColumn = find(
    columns,
    column => column.id === destinationId
  );

  const card = find(sourceColumn.cards, card => card.id === cardId);

  return !(
    card.type === 'ACTION' && destinationColumn.name === COLUMN.READY_TO_GO
  );
};

export const moving = (
  result: DropResult,
  destination: DraggableLocation,
  source: DraggableLocation,
  columns: Props[],
  cardId: string,
  hypothesisId: string,
  setColumns: Function,
  movingCard: Function,
  reorderColumn: Function
) => {
  const { droppableId: destinationId } = destination;
  const { droppableId: sourceId } = source;

  setColumns(reorderCards(result, columns));

  return destinationId === sourceId
    ? order(destinationId, columns, hypothesisId, reorderColumn)
    : move(sourceId, destinationId, columns, cardId, hypothesisId, movingCard);
};

export const createCardPayload = ({
  name,
  hypothesisId
}: CreateCardParams) => ({
  authorId: getProfile().id,
  branchName: '',
  description: '',
  hypothesisId,
  labels: [] as string[],
  modules: [] as string[],
  type: 'ACTION',
  name
});

export const areDropColumnsByNameDisabled = (name: string) =>
  name === COLUMN.BUILDS ||
  name === COLUMN.DEPLOYED_RELEASES ||
  name === COLUMN.TO_DO;

export const areDragColumnsByNameDisabled = (name: string) =>
  name === COLUMN.BUILDS || name === COLUMN.DEPLOYED_RELEASES;
