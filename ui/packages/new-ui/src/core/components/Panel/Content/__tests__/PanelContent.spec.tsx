import React from 'react';
import { render } from 'unit-test/testUtils';
import PanelContent from '../';

test('render PanelContent component with default properties', () => {
  const { getByText } = render(
    <PanelContent>children</PanelContent>
  );

  const panelElement = getByText('children');
  expect(panelElement).toBeInTheDocument();
});
