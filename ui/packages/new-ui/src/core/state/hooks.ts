import { useContext, useCallback } from 'react';
import store from './store';
import { State } from './interfaces/State';

export const useGlobalState = <T>(cb: (state: State) => T) => {
  const [state] = useContext(store);

  return cb(state);
};

export const useDispatch = () => {
  const [, dispatch] = useContext(store);
  const stableDispatch = useCallback(dispatch, []);

  return stableDispatch;
};
