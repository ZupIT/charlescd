import React from 'react';
import { render } from 'unit-test/testUtils';
import Card from '../';

test('render Card', () => {
  const { getByText } = render(
    <Card.Base>
      <Card.Body>
        content
      </Card.Body>
    </Card.Base>
  );

  expect(getByText('content')).toBeInTheDocument();
});
