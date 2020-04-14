import React from 'react';
import { render, fireEvent, wait } from 'unit-test/testUtils';
import ButtonIcon from '..';

test('render ButtonIcon default component', async () => {
  const click = jest.fn();
  const props = {
    name: 'cancel'
  }
  const { getByTestId } = render(
    <ButtonIcon onClick={click} name={props.name} />
  );
  
  await wait();

  const Button = getByTestId(`button-icon-${props.name}`);

  expect(Button).toBeInTheDocument();
  fireEvent.click(Button);
  expect(click).toBeCalled();
});
