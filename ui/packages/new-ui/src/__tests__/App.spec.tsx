import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

jest.mock('../Routes', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>App</div>;
    }
  };
});

test('Test routes render', async () => {
  const { container } = render(<App />);

  expect(container.innerHTML).toMatch('App');
});
