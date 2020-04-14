import get from 'lodash/get';
import { State } from './interfaces/State';
import { Reducer } from './interfaces/Reducer';
import { RootActionTypes } from '.';

export const combineReducer = (reducers: Reducer) => {
  const reducerKeys = Object.keys(reducers);

  return (state: State, action: RootActionTypes) => {
    let nextState = state;

    reducerKeys.map(key => {
      const reducer = get(reducers, key);
      const previousStateForKey = get(state, key);
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState = { ...nextState, [key]: nextStateForKey };

      return key;
    });

    return nextState;
  };
};
