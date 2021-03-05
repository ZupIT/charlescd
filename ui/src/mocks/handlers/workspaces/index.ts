import { basePath } from 'core/providers/base';
import { rest } from 'msw';
import { WORKSPACES_LIST } from './responses';

export default [
  rest.get(`${basePath}/moove/v2/workspaces`, (req, res, ctx) => {
    return res(
      ctx.json(WORKSPACES_LIST)
    )
  }),
];
