import { server } from 'mocks/server';
import { originalFetch } from 'setupTests';

beforeAll(() => {
  server.listen();
  global.fetch = originalFetch;
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
