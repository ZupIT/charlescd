import { FetchMock } from 'jest-fetch-mock';
import { findAllCircles, findCircleById } from '../circle';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('login provider request', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'find all circles' })
  );

  const response = await findAllCircles()({});
  const data = await response.json();

  expect(data).toEqual({ name: 'find all circles' });
});

test('renew token provider request', async () => {
  const id = 'circle-id';

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'find circle by id' })
  );

  const response = await findCircleById(id)({});
  const data = await response.json();

  expect(data).toEqual({ name: 'find circle by id' });
});
