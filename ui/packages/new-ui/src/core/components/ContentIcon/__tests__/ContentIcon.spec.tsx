import React from 'react';
import { renderWithTheme } from 'unit-test/testUtils';
import ContentIcon from '..';

test('renders ContentIcon component with default properties', () => {
  const { getByText, getByTestId } = renderWithTheme(
    <ContentIcon
      icon="charles"
    >
      <span>hello</span>
    </ContentIcon>
  );

  const childElement = getByText('hello');
  const contentElement = getByTestId('contentIcon-charles').querySelector(
    ':nth-child(2)'
  );
  const iconElement = getByTestId('icon-charles');

  expect(contentElement).toBeInTheDocument();
  expect(childElement).toBeInTheDocument();
  expect(iconElement).toBeInTheDocument();
});
