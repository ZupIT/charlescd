import { USER_DETAILS } from 'mocks/handlers/users/responses';
import { rest } from 'msw';
import { BASE_TEST_URL } from '../constants';

export default [
  rest.get(`${BASE_TEST_URL}/moove/v2/users/:userEmail`, (req, res, ctx) => {
    return res(
      ctx.json(USER_DETAILS)
    )
  }),
]
