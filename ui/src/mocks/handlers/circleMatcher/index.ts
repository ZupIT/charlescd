import { basePath } from 'core/providers/base';
import { rest } from 'msw';
import { IDENTIFY_SUCCESS } from './responses';

export default [
  rest.post(`${basePath}/charlescd-circle-matcher/identify`, (req, res, ctx) => {
    return res(
      ctx.json(IDENTIFY_SUCCESS)
    )
  }),
]
