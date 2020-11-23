/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement } from 'react';
import { render, screen, waitFor, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import MutationObserver from 'mutation-observer'
import { AllTheProviders } from "unit-test/testUtils";
import { FetchMock } from 'jest-fetch-mock/types';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import { Actions, Subjects } from 'core/utils/abilities';
import CirclesComparationItem from '..';
import * as DatasourceHooks from 'modules/Settings/Credentials/Sections/MetricProvider/hooks';

(global as any).MutationObserver = MutationObserver

interface fakeCanProps {
  I?: Actions;
  a?: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  allowedRoutes?: boolean;
  children: ReactElement;
}

jest.mock('containers/Can', () => {
  return {
    __esModule: true,
    default: ({ children }: fakeCanProps) => {
      return <div>{children}</div>;
    }
  };
});

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const props = {
  id: 'circle-001'
}

const circle = {
  name: 'Circle',
  deployment: {
    status: 'DEPLOYED'
  }
}

test('render CircleComparationItem default component', async () => {
  const handleChange = jest.fn();

  render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  const comparationItem = await screen.findByTestId(`circle-comparation-item-${props.id}`)
  const tabPanel = await screen.findByTestId(`tabpanel-Untitled`);

  expect(comparationItem).toBeInTheDocument();
  expect(tabPanel).toBeInTheDocument();
});

test('render CircleComparationItem with release', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123-workspace',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  jest.spyOn(DatasourceHooks, 'useDatasource').mockReturnValueOnce({
    responseAll: [],
    getAll: jest.fn
  });
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(circle))
    .mockResponseOnce(JSON.stringify(circle));
  const handleChange = jest.fn();

  render(
    <AllTheProviders>
      <CirclesComparationItem id={props.id} onChange={handleChange} />
    </AllTheProviders>
  );

  await waitFor(() => {
    expect(screen.getByTestId('layer-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('layer-metrics-groups')).toBeInTheDocument();
    expect(screen.getByText('Last release deployed')).toBeInTheDocument();
    expect(screen.getByText('Add datasource health')).toBeInTheDocument();
  });
});

test('render CircleComparationItem Default Circle', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'Default', deployment: {} }));
  const handleChange = jest.fn();

  render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  const DropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(DropdownIcon).toBeInTheDocument();

  act(() => userEvent.click(DropdownIcon));

  const DropdownActions = screen.getByTestId('dropdown-actions');

  await waitFor(() => {
    expect(DropdownActions).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-undeploy-Undeploy')).not.toBeInTheDocument();
    expect(screen.queryByTestId('layer-metrics')).not.toBeInTheDocument();
  });
});
