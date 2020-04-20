import React from 'react';
import { render } from 'unit-test/testUtils';
import Badge from '../';

test('render Badge', () => {
  const { getByText } = render(
    <Badge label="content" />
  );

  expect(getByText('content')).toBeInTheDocument();
});
