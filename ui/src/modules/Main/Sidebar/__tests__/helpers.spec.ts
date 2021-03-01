import {getItems} from '../helpers';
import {workspaceMenu, mainMenu, rootMainMenu} from './fixtures';
import * as utilsAuth from 'core/utils/auth';

test('should return workspace menu', () => {
  localStorage.setItem('workspace', '1234567890');

  const menu = getItems();
  expect(menu).toStrictEqual(workspaceMenu);
});

test('should return main menu for non-root user', () => {
  jest.spyOn(utilsAuth, 'isRoot').mockReturnValue(false);
  localStorage.setItem('workspace', '');

  const menu = getItems();
  expect(menu).toStrictEqual(mainMenu);
});

test('should return main menu for root user', () => {
  jest.spyOn(utilsAuth, 'isRoot').mockReturnValue(true);
  localStorage.setItem('workspace', '');

  const menu = getItems();
  expect(menu).toStrictEqual(rootMainMenu);
});