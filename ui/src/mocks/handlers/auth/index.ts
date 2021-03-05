import { basePath } from 'core/providers/base';
import { rest } from 'msw';
import { LOGIN_SUCCESS } from './responses';

export default [
  rest.post(`${basePath}/keycloak/auth/realms/:realm/protocol/openid-connect/token`, (req, res, ctx) => {
    return res(
      ctx.json(LOGIN_SUCCESS),
    )
  }),
]
