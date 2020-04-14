import { save, load, remove } from 'react-cookies';
import routes from 'core/constants/routes';
import { clearCircleId } from './circle';
import { clearProfile } from './profile';
import { clearApplication } from './workspace';
import { getCookieOptions } from './domain';

const accessTokenKey = 'access-token';
const refreshTokenKey = 'refresh-token';

export const setAccessToken = (token: string) =>
  save(accessTokenKey, token, getCookieOptions());

export const setRefreshToken = (token: string) =>
  save(refreshTokenKey, token, getCookieOptions());

export const getAccessToken = () => load(accessTokenKey);

export const getRefreshToken = () => load(refreshTokenKey);

export const isLogged = () => getAccessToken() && getRefreshToken();

export const clearSession = () => {
  remove(accessTokenKey, getCookieOptions());
  remove(refreshTokenKey, getCookieOptions());
  clearCircleId();
  clearProfile();
  clearApplication();
};

export const logout = () => {
  clearSession();
  window.location.href = routes.login;
};
