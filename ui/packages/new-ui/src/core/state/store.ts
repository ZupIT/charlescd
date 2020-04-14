import React, { Dispatch } from 'react';
import { State } from './interfaces/State';
import { RootActionTypes } from '.';

const store = React.createContext({} as [State, Dispatch<RootActionTypes>]);

export const { Provider, Consumer } = store;
export default store;
