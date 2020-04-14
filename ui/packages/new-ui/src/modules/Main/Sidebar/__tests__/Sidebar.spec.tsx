import React from 'react';
import { render, fireEvent } from 'unit-test/testUtils';
import routes from 'core/constants/routes';
import { dark } from 'core/assets/themes/sidebar';
import { genMenuId } from '../helpers';
import Sidebar from '../index';

const originalWindow = { ...window };

beforeEach(() => {
  delete window.location;

  window.location = {
    ...window.location,
    pathname: routes.workspace
  };
});

afterEach(() => {
  window = originalWindow;
});

test('renders sidebar component', async () => {
  const { getByTestId } = render(
    <Sidebar isExpanded={true} onClickExpand={null} />
  );
  const links = getByTestId('sidebar-links');

  const circleId = genMenuId(routes.circles);
  const hypothesesId = genMenuId(routes.hypotheses);
  const modulesId = genMenuId(routes.modules);
  const settingsId = genMenuId(routes.settings);

  expect(getByTestId(circleId)).toBeInTheDocument();
  expect(getByTestId(hypothesesId)).toBeInTheDocument();
  expect(getByTestId(modulesId)).toBeInTheDocument();
  expect(getByTestId(settingsId)).toBeInTheDocument();
  expect(links.children.length).toBe(5);
});

test('sidebar click expand submenu', () => {
  const { getByTestId } = render(<Sidebar isExpanded={true} onClickExpand={null} />);
  const settingsId = genMenuId(routes.settings);

  const settingsMenu = getByTestId(settingsId);
  fireEvent.click(settingsMenu);

  expect(settingsMenu.children.length).toBe(4);
});

test('sidebar click expand submenu and outside', () => {
  const clickExpand = jest.fn();
  const { getByTestId } = render(<Sidebar isExpanded={false} onClickExpand={clickExpand} />);
  const settingsId = genMenuId(routes.settings);

  const settingsMenu = getByTestId(settingsId);
  fireEvent.click(settingsMenu);

  const sidebar = getByTestId('sidebar');
  fireEvent.click(sidebar);

  expect(clickExpand).toHaveBeenCalled();
  expect(settingsMenu.children.length).toBe(1);
});

test('sidebar submenu page active', () => {
  const { getByTestId } = render(<Sidebar isExpanded={true} onClickExpand={null} />);
  const workspace = getByTestId(genMenuId(routes.workspace));
  const workspaceStyle = window.getComputedStyle(workspace.getElementsByTagName('a')[0]);

  expect(workspaceStyle.color).toBe(dark.menuTextActive);
});
