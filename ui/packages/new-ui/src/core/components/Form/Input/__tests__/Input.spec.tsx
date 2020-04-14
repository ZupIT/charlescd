import React from 'react';
import { render } from 'unit-test/testUtils';
import Input from '../';

test('renders input component with default properties', () => {
  const { getByTestId } = render(
    <Input type="text" name="keyName" autoComplete="off" />
  );

  const inputElement = getByTestId('input-keyName');
  expect(inputElement).toBeInTheDocument();
});

test('renders input component as a resume', () => {
  const { getByTestId } = render(
      <Input
        resume
        type="text"
        name="keyName"
        autoComplete="off"
    />);

  const inputElement = getByTestId('input-keyName');
  expect(inputElement).toBeInTheDocument();
  expect(inputElement).toHaveStyle('background: transparent;');
  expect(inputElement).toHaveStyle('border: none;');
});

test('renders input component with label', () => {
  const { container } = render(<Input type="text" name="keyName" label="Label" />);
  expect(container).toHaveTextContent('Label');
});

test('floating label when input has value', () => {
  const { container } = render(<Input type="text" name="keyName" defaultValue="value" label="Label" />);

  const labelElement = container.getElementsByTagName('label').item(0);
  const labelStyle = window.getComputedStyle(labelElement);
  expect(labelStyle.top).toBe('0px');
});
