import { rest } from 'msw';
import { IDENTIFY_SUCCESS } from './responses/circleMatcher';
import { LOGIN_SUCCESS } from './responses/login';
import { USER_DETAILS } from './responses/users';
import { WORKSPACES_LIST } from './responses/workspaces';

const basePath = 'http://localhost:8000'

export const handlers = [
  rest.post(`${basePath}/keycloak/auth/realms/:realm/protocol/openid-connect/token`, (req, res, ctx) => {
    return res(
      ctx.json(LOGIN_SUCCESS),
    )
  }),
  rest.post(`${basePath}/charlescd-circle-matcher/identify`, (req, res, ctx) => {
    return res(
      ctx.json(IDENTIFY_SUCCESS)
    )
  }),
  rest.get(`${basePath}/moove/v2/users/:userEmail`, (req, res, ctx) => {
    return res(
      ctx.json(USER_DETAILS)
    )
  }),
  rest.get(`${basePath}/moove/v2/workspaces`, (req, res, ctx) => {
    return res(
      ctx.json(WORKSPACES_LIST)
    )
  }),
]
