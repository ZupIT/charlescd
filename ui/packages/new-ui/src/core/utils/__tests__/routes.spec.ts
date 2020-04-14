import { renderHook, act } from '@testing-library/react-hooks';
import { useRouter, getPath, redirectToLegacy, getV1Path } from '../routes';
import { MemoryRouter } from 'react-router-dom';
import { hostLegacyDevelopment, isDevelopmentLegacyHost } from '../development';

const mockPush = jest.fn();
const mockGo = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn().mockImplementation(mockPush),
    goBack: jest.fn().mockImplementation(mockGoBack),
    go: jest.fn().mockImplementation(mockGo),
    replace: jest.fn().mockImplementation(mockReplace)
  })
}));

test('useRouter functions have been called with params', () => {
  const { result } = renderHook(() => useRouter(), { wrapper: MemoryRouter });
  const router = result.current;

  router.push('/help');
  router.goBack();
  router.go(1);
  router.replace('/help');

  expect(mockPush).toHaveBeenCalledWith('/help');
  expect(mockGoBack).toHaveBeenCalled();
  expect(mockGo).toHaveBeenCalledWith(1);
  expect(mockReplace).toHaveBeenCalledWith('/help');
});

test('get path by url and valid param', () => {
  expect(getPath('/:name1/:name2', ['test1', 'test2'])).toEqual('/test1/test2');
});

test('get path by url and invalid params length', () => {
  expect(getPath('/:name1/:name2', ['test'])).toEqual('/:name1/:name2');
});

test('redirect to legacy', () => {
  const originalWindow = { ...window };
  delete window.location;

  process.env = Object.assign(process.env, { NODE_ENV: 'production' });

  window.location = {
    ...window.location,
    href: '',
    pathname: ''
  };

  redirectToLegacy('/test');

  expect(window.location.href).toEqual('/test');

  Object.assign(process.env, { NODE_ENV: 'test' });
  Object.assign(window, originalWindow);
});

test('redirect to legacy login', () => {
  const originalWindow = { ...window };
  const href = 'http://localhost:3000/v2';

  delete window.location;

  window.location = {
    ...window.location,
    pathname: '',
    href
  };

  redirectToLegacy(`${isDevelopmentLegacyHost()}/auth/login`);

  expect(window.location.href).toEqual(
    `${hostLegacyDevelopment}/auth/login?redirectTo=${href}`
  );

  Object.assign(window, originalWindow);
});
