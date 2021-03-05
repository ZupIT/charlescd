import { rest } from 'msw';
import { BASE_TEST_URL } from '../constants';
import { LOGIN_SUCCESS } from './responses';

export default [
  rest.post(`${BASE_TEST_URL}/keycloak/auth/realms/:realm/protocol/openid-connect/token`, (req, res, ctx) => {
    return res(
      ctx.json(LOGIN_SUCCESS),
    )
  }),
]
