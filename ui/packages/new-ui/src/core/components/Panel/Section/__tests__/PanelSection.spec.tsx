import React from 'react';
import { render } from 'unit-test/testUtils';
import PanelSection from '../';

test('render PanelSection component with default properties', () => {
  const { getByText } = render(
    <PanelSection>children</PanelSection>
  );

  const panelElement = getByText('children');
  expect(panelElement).toBeInTheDocument();
});
