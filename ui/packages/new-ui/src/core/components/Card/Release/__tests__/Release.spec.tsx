import React from 'react';
import { render } from 'unit-test/testUtils';
import CardRelease from '../';

test('render CardRelease component with nodes', () => {
  const { getByText } = render(
    <CardRelease status="deployed" description="tag-rc-1" />
  );

  expect(getByText('deployed')).toBeInTheDocument();
  expect(getByText('tag-rc-1')).toBeInTheDocument();
});
