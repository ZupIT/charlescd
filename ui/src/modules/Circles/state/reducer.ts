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
import { CircleState } from '../interfaces/CircleState';
import { CirclesActionTypes, ACTION_TYPES } from './actions';
import { CirclePagination } from '../interfaces/CirclesPagination';

const initialListState: CirclePagination = {
  content: [],
  page: 0,
  size: 0,
  totalPages: 0,
  last: false
};

export const circlesInitialState: CircleState = {
  list: initialListState,
  metrics: initialListState,
  item: null
};

export const circlesReducer = (
  state = circlesInitialState,
  action: CirclesActionTypes
): CircleState => {
  switch (action.type) {
    case ACTION_TYPES.loadedCircles: {
      return {
        ...state,
        list: action.payload
      };
    }
    case ACTION_TYPES.loadedCircle: {
      return {
        ...state,
        item: action.payload
      };
    }
    case ACTION_TYPES.loadedCirclesMetrics: {
      return {
        ...state,
        metrics: action.payload
      };
    }
    case ACTION_TYPES.updateCircles: {
      const { payload } = action;
      const [newCircle] = payload;
      const content = map(state.list.content, circle => {
        return circle?.id === newCircle?.id ? newCircle : circle;
      });

      return {
        ...state,
        list: {
          ...state.list,
          content
        }
      };
    }
    default: {
      return state;
    }
  }
};
