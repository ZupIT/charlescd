import { rest } from 'msw';
import { BASE_TEST_URL } from '../constants';
import { IDENTIFY_SUCCESS } from './responses';

export default [
  rest.post(`${BASE_TEST_URL}/charlescd-circle-matcher/identify`, (req, res, ctx) => {
    return res(
      ctx.json(IDENTIFY_SUCCESS)
    )
  }),
]
