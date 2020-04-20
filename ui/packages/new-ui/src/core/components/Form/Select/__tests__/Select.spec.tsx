import React from 'react';
import { render } from 'unit-test/testUtils';
import Select from '../Select';

test('render select component', () => {
  const options = [{ value: 'apple', label: 'apple' }];

  const { getByTestId } = render(<Select options={options} />);

  expect(getByTestId('react-select')).toBeInTheDocument();
});
