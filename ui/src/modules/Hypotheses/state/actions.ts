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

import { Column, Card } from '../Board/interfaces';
import { Hypothesis } from '../interfaces';

export enum ACTION_TYPES {
  updateBoard = 'BOARD/UPDATE',
  updateColumn = 'BOARD/COLUMN/UPDATE',
  updateCard = 'BOARD/CARD/UPDATE',
  loadedHypotheses = 'HYPOTHESES/LOADED'
}

interface UpdateBoard {
  type: typeof ACTION_TYPES.updateBoard;
  payload: Column[];
}

export const setBoard = (payload: Column[]): UpdateBoard => ({
  type: ACTION_TYPES.updateBoard,
  payload
});

interface UpdateColumn {
  type: typeof ACTION_TYPES.updateColumn;
  payload: Column;
}

export const setColumn = (payload: Column): UpdateColumn => ({
  type: ACTION_TYPES.updateColumn,
  payload
});

interface UpdateCard {
  type: typeof ACTION_TYPES.updateCard;
  columnId: string;
  payload: Card;
}

export const setCard = (columnId: string, payload: Card): UpdateCard => ({
  type: ACTION_TYPES.updateCard,
  columnId,
  payload
});

interface LoadedHypotheses {
  type: typeof ACTION_TYPES.loadedHypotheses;
  payload: Hypothesis[];
}

export const loadedHypotheses = (payload: Hypothesis[]): LoadedHypotheses => ({
  type: ACTION_TYPES.loadedHypotheses,
  payload
});

export type HypothesesActionTypes =
  | UpdateBoard
  | UpdateColumn
  | UpdateCard
  | LoadedHypotheses;
