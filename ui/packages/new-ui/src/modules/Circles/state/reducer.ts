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
    default: {
      return state;
    }
  }
};
