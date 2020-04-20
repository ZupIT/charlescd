import React from 'react';
import { render } from 'unit-test/testUtils';
import Page from '../';

test('renders Menu Page component with default properties', () => {
  const { getByText } = render(
    <Page>
      <Page.Menu>page menu</Page.Menu>
      <Page.Content>page content</Page.Content>
    </Page>
  );

  const menuElement = getByText('page menu');
  const contentElement = getByText('page content');
  expect(menuElement).toBeInTheDocument();
  expect(contentElement).toBeInTheDocument();
});
