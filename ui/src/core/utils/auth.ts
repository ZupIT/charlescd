/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import JwtDecode from 'jwt-decode';
import get from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';
import routes from 'core/constants/routes';
import { getWorkspaceId } from 'core/utils/workspace';
import { clearCircleId } from './circle';
import { clearProfile } from './profile';
import { clearWorkspace } from './workspace';
import { HTTP_STATUS } from 'core/enums/HttpStatus';

type AccessToken = {
  id?: string;
  name?: string;
  isRoot?: boolean;
  workspaces?: {
    id: string;
    roles: string[];
  }[];
};

const accessTokenKey = 'access-token';
const refreshTokenKey = 'refresh-token';

export const setAccessToken = (token: string) =>
  localStorage.setItem(accessTokenKey, token);

export const setRefreshToken = (token: string) =>
  localStorage.setItem(refreshTokenKey, token);

export const getAccessToken = () => localStorage.getItem(accessTokenKey);

export const getAccessTokenDecoded = (): AccessToken => {
  try {
    return JwtDecode(getAccessToken());
  } catch (e) {
    return {};
  }
};

export const isRoot = () => {
  const token = getAccessTokenDecoded();
  return token?.isRoot || false;
};

export const isRootRoute = (route: string) => includes(route, 'root');

export const getRoles = () => {
  try {
    const id = getWorkspaceId();
    const token = getAccessTokenDecoded();
    const workspaces = get(token, 'workspaces', []);
    const { permissions } = find(workspaces, ['id', id]);
    return permissions || [];
  } catch (e) {
    return '';
  }
};

export const getRefreshToken = () => localStorage.getItem(refreshTokenKey);

export const isLogged = () => getAccessToken() && getRefreshToken();

export const clearSession = () => {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
  clearCircleId();
  clearProfile();
  clearWorkspace();
};

export function saveSessionData(accessToken: string, refreshToken: string) {
  localStorage.setItem(accessTokenKey, accessToken);
  localStorage.setItem(refreshTokenKey, refreshToken);
}

export const logout = () => {
  clearSession();
  window.location.href = routes.login;
};

export const checkStatus = (status: number) => {
  if (status === HTTP_STATUS.unauthorized) {
    logout();
  }
};
