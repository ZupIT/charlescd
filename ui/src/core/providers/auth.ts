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

import { authRequest, unauthenticatedRequest } from './base';

const circleMatcherEndpoint = '/charlescd-circle-matcher/identify';
const endpoint = '/auth/realms/darwin/protocol/openid-connect/token';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const clientId = 'darwin-client';

export const login = (username: string, password: string) => {
  const grantType = 'password';
  const data = `grant_type=${grantType}&client_id=${clientId}&username=${username}&password=${password}`;

  return authRequest(endpoint, data, { method: 'POST', headers });
};

export const circleMatcher = (payload: unknown) => {
  const data = {
    requestData: payload
  };
  return unauthenticatedRequest(circleMatcherEndpoint, data, {
    method: 'POST'
  });
};

export const renewToken = (refreshToken: string) => {
  const grantType = 'refresh_token';
  const data = `grant_type=${grantType}&client_id=${clientId}&refresh_token=${refreshToken}`;

  return authRequest(endpoint, data, { method: 'POST', headers });
};
