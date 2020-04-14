import React from 'react';
import { render, fireEvent, wait } from 'unit-test/testUtils';
import { Action as MenuAction } from '..';
import Menu from '..';

const menuFilterItemsMock: MenuAction[] = [
  {
    label: 'Action 1',
    name: 'first_action',
    icon: 'charles'
  },
  {
    label: 'Action 2',
    name: 'second_action'
  }
];


test('render Menu', () => {
  const { getByText, getByTestId } = render(
    <Menu
      actions={menuFilterItemsMock}
      active={menuFilterItemsMock[0].name}
      onSelect={jest.fn()}
    >
       content
    </Menu>
  );
  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  expect(getByTestId('icon-checkmark')).toBeInTheDocument();
  expect(menuContentElement).toBeInTheDocument();
});

test('trigger Menu actions', () => {
  const { getByText, getAllByText } = render(
    <Menu actions={menuFilterItemsMock} onSelect={jest.fn()}>
       content
    </Menu>
  );

  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  const actionsElements = getAllByText(/Action/);
  expect(actionsElements.length).toBe(2);
  expect(menuContentElement).toBeInTheDocument();
  fireEvent.click(menuContentElement);
  wait(() => expect(actionsElements.length).toBe(0));
});

test('trigger Menu select action', () => {
  const onSelect = jest.fn();
  const { getByText, getAllByText } = render(
    <Menu actions={menuFilterItemsMock} onSelect={onSelect}>
       content
    </Menu>
  );
  const menuContentElement = getByText('content');
  fireEvent.click(menuContentElement);
  const actionsElements = getAllByText(/Action/);
  fireEvent.click(actionsElements[0]);
  expect(onSelect).toHaveBeenCalledWith('first_action');
  wait(() => expect(actionsElements.length).toBe(0));
});
