import React from 'react';
import { render, screen, fireEvent } from 'unit-test/testUtils';
import ReleaseRow from '../ReleaseRow';

const circleReleaseMock = {
  id: '1',
  name: 'release 1',
  deployed: '2020-07-12 10:25:38',
  undeployed: '2020-07-11 10:25:38',
  lastEditor: 'Jhon Doe',
  components: [
    {
      id: '1',
      moduleName: 'module a1',
      componentName: 'component 1',
      version: '1.0'
    },
    {
      id: '2',
      moduleName: 'module a2',
      componentName: 'component 2',
      version: '1.0'
    }
  ]
}

test('render default ReleaseRow', () => {
  render(
    <ReleaseRow release={circleReleaseMock} />
  );

  expect(screen.getByText('release 1')).toBeInTheDocument();
  expect(screen.getByText('12/07/2020 10:07')).toBeInTheDocument();
  expect(screen.getByText('11/07/2020 10:07')).toBeInTheDocument();
  expect(screen.getByText('Jhon Doe')).toBeInTheDocument();
  expect(screen.queryAllByText(/module a/)).toHaveLength(0);
  expect(() => screen.getByText('your text')).toThrow();
});

test('render default ReleaseRow and show components table', () => {
  render(
    <ReleaseRow release={circleReleaseMock} />
  );

  const tableRow = screen.getByTestId('release-table-row-1');
  fireEvent.click(tableRow);

  expect(screen.getAllByText(/module a/)).toHaveLength(2);
});
