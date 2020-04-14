import React from 'react';
import { render } from 'unit-test/testUtils';
import CardBody from '../';

test('render Card component with content', () => {
  const { getByText } = render(<CardBody>hello</CardBody>);

  const linkElement = getByText('hello');
  expect(linkElement).toHaveTextContent('hello');
});

test('render Card component with margins', () => {
  const { getByText } = render(<CardBody>hello</CardBody>);

  const linkElement = getByText('hello');
  expect(linkElement).toHaveStyle('margin-left: 17px;');
  expect(linkElement).toHaveStyle('margin-right: 17px;');
});
