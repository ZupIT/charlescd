import React from 'react';
import { render, fireEvent, wait } from 'unit-test/testUtils';
import { dark as inputTheme } from 'core/assets/themes/input';
import SearchInput from '../';

test('renders search input component with default properties', () => {
  const { getByTestId } = render(<SearchInput onSearch={jest.fn} />);

  const iconElement = getByTestId('icon-search');

  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
  expect(iconElement).toBeInTheDocument();
});

test('trigger focus and blur events', () => {
  const { getByTestId } = render(<SearchInput onSearch={jest.fn} />);
  const element = getByTestId('input-search');

  fireEvent.focus(element);
  const iconElement = getByTestId('icon-search');

  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.focus.color};`);
  fireEvent.blur(element);
  expect(iconElement).toHaveStyle(`color: ${inputTheme.search.color};`);
});

test('trigger change event', () => {
  const onSearch = jest.fn();
  const value = "Foo bar";
  const { getByTestId } = render(<SearchInput onSearch={onSearch} />);
  const element = getByTestId('input-search') as HTMLInputElement;

  fireEvent.change(element, { target: { value }});

  wait(() => {
    expect(onSearch).toHaveBeenCalledWith(value)
  })
});
