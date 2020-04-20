import React from 'react';
import { render } from 'unit-test/testUtils';
import LabeledIcon from '../';

test('renders LabeledIcon component with default properties', () => {
  const { getByText, getByTestId } = render(
    <LabeledIcon
      icon="charles"
    >
      <span>hello</span>
    </LabeledIcon>
  );

  const childElement = getByText('hello')
  const labelElement = getByTestId('labeledIcon-charles').querySelector(':nth-child(2)')
  const iconElement = getByTestId('icon-charles')

  expect(labelElement).toBeInTheDocument();
  expect(labelElement).toHaveStyle('margin-left: 5px;');
  expect(childElement).toBeInTheDocument();
  expect(iconElement).toBeInTheDocument();
});

test('renders LabeledIcon component with marginContent', () => {
  const { getByText, getByTestId } = render(
    <LabeledIcon
      icon="charles"
      marginContent="20px"
    >
      <span>hello</span>
    </LabeledIcon>
  );

  const childElement = getByText('hello')
  const labelElement = getByTestId('labeledIcon-charles').querySelector(':nth-child(2)')
  const iconElement = getByTestId('icon-charles')

  expect(labelElement).toBeInTheDocument();
  expect(labelElement).toHaveStyle('margin-left: 20px;');
  expect(childElement).toBeInTheDocument();
  expect(iconElement).toBeInTheDocument();
});
