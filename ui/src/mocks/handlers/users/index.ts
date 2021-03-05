import { rest } from 'msw';
import { USER_DETAILS } from 'mocks/handlers/users/responses';
import { basePath } from 'core/providers/base';

export default [
  rest.get(`${basePath}/moove/v2/users/:userEmail`, (req, res, ctx) => {
    return res(
      ctx.json(USER_DETAILS)
    )
  }),
]
