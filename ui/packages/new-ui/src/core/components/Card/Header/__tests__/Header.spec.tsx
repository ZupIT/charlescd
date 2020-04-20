import React from 'react';
import { render } from 'unit-test/testUtils';
import CardHeader from '../';

test('render CardHeader component with nodes', () => {
  const Icon = <div>icon</div>
  const Action = <div>action</div>

  const { getByText } = render(
    <CardHeader icon={Icon} action={Action}>hello</CardHeader>
  );

  expect(getByText('hello')).toBeInTheDocument();
  expect(getByText('icon')).toBeInTheDocument();
  expect(getByText('action')).toBeInTheDocument();
});
