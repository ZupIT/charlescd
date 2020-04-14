import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useGlobalState, useDispatch } from '../hooks';
import { AllTheProviders as wrapper } from 'unit-test/testUtils';
import { circlesInitialState } from 'modules/Circles/state/reducer';

test('useGlobalState', () => {
  const { result } = renderHook(() => useGlobalState(state => state.circles), {
    wrapper
  });

  expect(result.current).toEqual(circlesInitialState);
});

test('useDispatch', () => {
  const { result } = renderHook(() => useDispatch(), { wrapper });

  expect(result.current).toEqual(expect.any(Function));
});
