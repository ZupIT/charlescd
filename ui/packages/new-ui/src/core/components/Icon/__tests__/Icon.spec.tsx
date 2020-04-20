import React from 'react';
import { render } from 'unit-test/testUtils';
import Icon from '../index';

test('renders icon component with default properties', () => {
  const props = {
    name: 'menu'
  };
  const { getByTestId } = render(<Icon {...props} />);
  const icon = getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');
  const svgStyle = window.getComputedStyle(svg);
  const iconStyle = window.getComputedStyle(icon);

  expect(svgStyle.width).toBe('');
  expect(svgStyle.height).toBe('');
  expect(iconStyle.color).toBe('');
});

test('renders icon component with properties', () => {
  const props = {
    name: 'menu',
    size: '200px',
    color: 'red'
  };
  const { getByTestId } = render(<Icon {...props} />);

  const icon = getByTestId(`icon-${props.name}`);
  const svg = icon.querySelector('svg');
  const svgStyle = window.getComputedStyle(svg);
  const iconStyle = window.getComputedStyle(icon);

  expect(svgStyle.width).toBe(props.size);
  expect(svgStyle.height).toBe(props.size);
  expect(iconStyle.color).toBe(props.color);
});
