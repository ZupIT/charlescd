/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import { authRequest, unauthenticatedRequest } from './base';

const client = window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_CLIENT_ID;
const realm = window.CHARLESCD_ENVIRONMENT?.REACT_APP_AUTH_REALM;
const redirectUri = window.CHARLESCD_ENVIRONMENT?.REACT_APP_IDM_REDIRECT_URI;
const workspaceId =
  window.CHARLESCD_ENVIRONMENT?.REACT_APP_WORKSPACE_ID || 'UNKNOWN';

const endpoint = `/auth/realms/${realm}/protocol/openid-connect/token`;
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

export const login = (username: string, password: string) => {
  const grantType = 'password';
  const encodedPassword = encodeURIComponent(password);
  const data = `grant_type=${grantType}&client_id=${client}&username=${username}&password=${encodedPassword}`;

  return authRequest(endpoint, data, { method: 'POST', headers });
};

export const circleMatcher = (payload: unknown) => {
  const data = {
    requestData: payload,
    workspaceId
  };

  return unauthenticatedRequest( data, {
    method: 'POST'
  });
};

export const codeToTokens = (code: string) => {
  const grantType = 'authorization_code';
  const data = `grant_type=${grantType}&client_id=${client}&code=${code}&redirect_uri=${redirectUri}`;

  return authRequest(endpoint, data, { method: 'POST', headers });
};

export const renewToken = (refreshToken: string) => {
  const grantType = 'refresh_token';
  const data = `grant_type=${grantType}&client_id=${client}&refresh_token=${refreshToken}`;

  return authRequest(endpoint, data, { method: 'POST', headers });
};
