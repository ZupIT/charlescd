import { isDevelopmentLegacyHost, hostLegacyDevelopment } from '../development';

test('is development host legacy', () => {
  expect(isDevelopmentLegacyHost()).toEqual(hostLegacyDevelopment);
});

test('is not development host legacy', () => {
  process.env = Object.assign(process.env, { NODE_ENV: 'production' });
  expect(isDevelopmentLegacyHost()).toEqual('https://localhost');
  process.env = Object.assign(process.env, { NODE_ENV: 'test' });
});
