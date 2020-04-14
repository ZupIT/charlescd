import React from 'react';
import { renderWithTheme } from 'unit-test/testUtils';
import GlobalStyle from '../global';

test('global style', () => {
  renderWithTheme(
    <div>
      <GlobalStyle />
    </div>
  );
  expect(window.getComputedStyle(document.body)).toMatchSnapshot();
});