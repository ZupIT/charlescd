import {getItems} from '../helpers';
import routes from 'core/constants/routes';
import {workspaceMenu, mainMenu, rootMainMenu} from './fixtures';
import * as utilsAuth from 'core/utils/auth';

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.workspaces
  };
});

afterEach(() => {
  window = originalWindow;
});


test('should return workspace menu', () => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.circles
  };

  localStorage.setItem('workspace', '1234567890');

  const menu = getItems();
  expect(menu).toStrictEqual(workspaceMenu);
});

test('should return main menu for non-root user', () => {
  const menu = getItems();
  expect(menu).toStrictEqual(mainMenu);
});

test('should return main menu for root user', () => {
  jest.spyOn(utilsAuth, 'isRoot').mockReturnValue(true);

  const menu = getItems();
  expect(menu).toStrictEqual(rootMainMenu);
});