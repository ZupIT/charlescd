import { FetchMock } from 'jest-fetch-mock';
import { login, renewToken } from '../auth';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('login provider request', async () => {
  const username = 'user';
  const password = 'password';

  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'login' }));

  const response = await login(username, password)({});
  const data = await response.json();

  expect(data).toEqual({ name: 'login' });
});

test('renew token provider request', async () => {
  const refreshToken = 'refreshToken';

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'renew-token' })
  );

  const response = await renewToken(refreshToken)({});
  const data = await response.json();

  expect(data).toEqual({ name: 'renew-token' });
});
