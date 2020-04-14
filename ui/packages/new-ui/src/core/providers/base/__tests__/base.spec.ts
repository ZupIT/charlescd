import { FetchMock } from 'jest-fetch-mock';
import { baseRequest } from '..';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('base request success', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'base request' })
  );

  const response = await baseRequest('/test', {}, { method: 'POST' })({});
  const data = await response.json();

  expect(data).toEqual({ name: 'base request' });
});

test('base request reject', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ name: 'base request' }), {
    status: 401
  });

  baseRequest(
    '/test',
    {},
    { method: 'POST' }
  )({}).catch(async err =>
    expect(await err.json()).toEqual({ name: 'base request' })
  );
});
