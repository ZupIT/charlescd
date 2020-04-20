import React from 'react';
import { render, wait } from 'unit-test/testUtils';
import Routes from '../Routes';

jest.mock('modules/Main', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>Main</div>;
    }
  };
});

jest.mock('core/constants/routes', () => {
  return {
    routes: {
      baseName: '/'
    }
  };
});

test('render default route', async () => {
  const { container } = render(<Routes />);

  await wait(() =>expect(container.innerHTML).toMatch('Main'));
});
