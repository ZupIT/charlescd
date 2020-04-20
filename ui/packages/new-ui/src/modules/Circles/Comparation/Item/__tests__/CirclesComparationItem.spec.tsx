import React from 'react';
import { render, wait } from 'unit-test/testUtils';
import CirclesComprationItem from '../';

test('render CirclesComprationItem default component', async () => {
  const props = {
    id: 'a1-b2-c3-d4'
  };
  const { getByTestId } = render(
    <CirclesComprationItem {...props} />
  );

  await wait();

  expect(getByTestId(`circles-comparation-item-${props.id}`)).toBeInTheDocument();
});
