import React from 'react';
import { render } from 'unit-test/testUtils';
import * as dateUtils from 'core/utils/date';
import CardCircle from '../';

test('render CardCircle with children', () => {
  jest.spyOn(dateUtils, 'dateFrom').mockImplementation(value => value);

  const { getByText } = render(
    <CardCircle circle="woman" deployedAt="2020">
      content
    </CardCircle>
  );

  expect(getByText(/2020/)).toBeInTheDocument();
  expect(getByText('woman')).toBeInTheDocument();
  expect(getByText('content')).toBeInTheDocument();
});
