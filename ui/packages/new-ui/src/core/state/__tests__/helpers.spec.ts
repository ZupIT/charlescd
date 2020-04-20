import { loadedCirclesAction } from 'modules/Circles/state/actions';
import { combineReducer } from '../helpers';
import { reducers, rootState } from '..';

test('combine reducers', () => {
  const rootReducer = combineReducer(reducers);

  expect(rootReducer(rootState, loadedCirclesAction)).toEqual(rootState);
});
