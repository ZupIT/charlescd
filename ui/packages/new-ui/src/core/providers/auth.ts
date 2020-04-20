import { baseRequest } from './base';

const endpoint = '/auth/realms/darwin/protocol/openid-connect/token';
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
const clientId = 'darwin-client';

export const login = (username: string, password: string) => {
  const grantType = 'password';
  const data = `grant_type=${grantType}&client_id=${clientId}&username=${username}&password=${password}`;

  return baseRequest(endpoint, data, { method: 'POST', headers });
};

export const renewToken = (refreshToken: string) => {
  const grantType = 'refresh_token';
  const data = `grant_type=${grantType}&client_id=${clientId}&refresh_token=${refreshToken}`;

  return baseRequest(endpoint, data, { method: 'POST', headers });
};
