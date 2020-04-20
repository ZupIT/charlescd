import { renderHook, act } from '@testing-library/react-hooks';
import { FetchMock } from 'jest-fetch-mock';
import { useFetch } from '../hooks';
import { baseRequest } from '..';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('useFetch hook initial state', () => {
  const fakeBaseRequest = () => baseRequest('/fake');
  const { result } = renderHook(() => useFetch(fakeBaseRequest));
  const [data, trigger] = result.current;


  expect(data.response).toEqual(undefined);
  expect(data.error).toEqual(null);
  expect(data.loading).toEqual(false);
  expect(trigger).toEqual(expect.any(Function));
});

test('useFetch hook trigger promise success', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const fakeBaseRequest = () => baseRequest('/fake');
  const { result } = renderHook(() => useFetch(fakeBaseRequest));

  await act(async () => result.current[1]());

  expect(result.current[0].response).toEqual({ name: 'use fetch' });
});

test('useFetch hook trigger promise error', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }), {
    status: 500
  });
  const fakeBaseRequest = () => baseRequest('/fake');
  const { result } = renderHook(() => useFetch(fakeBaseRequest));

  await act(async () => result.current[1]());

  const data = await result.current[0].error.json();

  expect(data).toEqual({ name: 'use fetch' });
});
