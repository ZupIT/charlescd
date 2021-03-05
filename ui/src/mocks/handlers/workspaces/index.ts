import { rest } from 'msw';
import { BASE_TEST_URL } from '../constants';
import { WORKSPACES_LIST } from './responses';

export default [
  rest.get(`${BASE_TEST_URL}/moove/v2/workspaces`, (req, res, ctx) => {
    return res(
      ctx.json(WORKSPACES_LIST)
    )
  }),
];
