import React from 'react';
import { render, act } from 'unit-test/testUtils';
import Dropdown, { Action as IAction } from '../';

const dropdownActionsMock: IAction[] = [
  {
    icon: 'delete',
    name: 'delete',
    onClick: () => jest.fn()
  },
];

test('render Dropdown', async () => {
  const promise = Promise.resolve();
  const { getByTestId } = render(
    <Dropdown actions={dropdownActionsMock} />
  );
  
  await act(() => promise);

  const element = getByTestId('dropdown')
  expect(element).toBeInTheDocument();
});
