import React from 'react';
import { render } from 'unit-test/testUtils';
import Card from '../';

test('render Card component with children', () => {
  const { getByText } = render(<Card>hello</Card>);

  const linkElement = getByText('hello');
  expect(linkElement).toHaveTextContent('hello');
});
