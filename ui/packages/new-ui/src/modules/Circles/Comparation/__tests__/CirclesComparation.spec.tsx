import React from 'react';
import { render } from 'unit-test/testUtils';
import CirclesCompration from '../';

test('render ButtonBase default component', () => {
  const { getByTestId } = render(
    <CirclesCompration />
  );
  expect(getByTestId('circles-comparation')).toBeInTheDocument();
});
