import React from 'react';
import { FetchMock } from 'jest-fetch-mock/types';
import { render } from 'unit-test/testUtils';
import { dark } from 'core/assets/themes/sidebar';
import { genMenuId } from '../Sidebar/helpers';
import Main from '../index';

jest.mock('modules/Circles', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Circles</div>;
    }
  };
});

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: '/v2/circles'
  };
});

afterEach(() => {
  window = originalWindow;
});

test('renders menu component', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const { getByTestId } = render(<Main />);

  const sidebar = getByTestId('sidebar');
  const content = getByTestId('main-content');
  const footer = getByTestId('footer');

  expect(sidebar.tagName).toBe('NAV');
  expect(content.tagName).toBe('SECTION');
  expect(footer.tagName).toBe('FOOTER');
});

test('collapse sidebar', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const menuId = genMenuId(window.location.pathname);
  const { getByTestId } = render(<Main />);

  const expandButton = getByTestId('sidebar-expand-button');

  expect(getByTestId(menuId)).toHaveTextContent(/\w+/gi);

  expandButton.click();

  expect(getByTestId(menuId).textContent).toBe('');
});

test('render menu in expanded mode with the circle screen active', () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'use fetch' }));
  const { getByTestId } = render(<Main />);
  const icon = getByTestId('icon-circles');
  const iconStyle = window.getComputedStyle(icon);

  expect(iconStyle.color).toBe(dark.menuIconActive);
});
