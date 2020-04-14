import React from 'react';
import { render, fireEvent } from 'unit-test/testUtils';
import Button from 'core/components/Button';

test('render Button default component', async () => {
  const click = jest.fn();
  const id = 'test';
  const { getByTestId } = render(
    <Button.Default id={id} onClick={click}>button</Button.Default>
  );

  const ButtonDefault = getByTestId(`button-default-${id}`);

  expect(ButtonDefault).toBeInTheDocument();
  fireEvent.click(ButtonDefault);
  expect(click).toBeCalled();
});
