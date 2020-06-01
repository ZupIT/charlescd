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

import filter from 'lodash/filter';
import partition from 'lodash/partition';
import map from 'lodash/map';
import { HypothesesState } from '../interfaces';
import { HypothesesActionTypes, ACTION_TYPES } from './actions';

export const hypothesisInitialState: HypothesesState = {
  columns: [],
  hypotheses: []
};

export const hypothesesReducer = (
  state = hypothesisInitialState,
  action: HypothesesActionTypes
): HypothesesState => {
  switch (action.type) {
    case ACTION_TYPES.updateBoard: {
      return {
        ...state,
        columns: action.payload
      };
    }
    case ACTION_TYPES.updateColumn: {
      const otherColumns = filter(
        state.columns,
        column => column.id !== action.payload.id
      );
      return {
        ...state,
        columns: [action.payload, ...otherColumns]
      };
    }
    case ACTION_TYPES.updateCard: {
      const board = partition(
        state.columns,
        column => column.id === action.columnId
      );

      const currentColumn = board[0][0];
      const otherColumns = board[1];

      const cards = map(currentColumn?.cards, card => {
        if (card.id === action.payload.id) {
          return action.payload;
        }

        return card;
      });

      return {
        ...state,
        columns: [
          {
            ...currentColumn,
            cards: cards
          },
          ...otherColumns
        ]
      };
    }
    case ACTION_TYPES.loadedHypotheses: {
      return {
        ...state,
        hypotheses: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
