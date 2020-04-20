import { setAccessToken, setRefreshToken, isLogged } from '../auth';

test('is logged', () => {
  setAccessToken('accessToken');
  setRefreshToken('refreshToken');

  expect(isLogged()).toBeTruthy();
});

test('set access-token in cookie ', () => {
  setAccessToken('accessToken');

  expect(document.cookie).toContain('access-token=accessToken');
});

test('set refresh-token in cookie ', () => {
  setRefreshToken('refreshToken');
  expect(document.cookie).toContain('refresh-token=refreshToken');
});
