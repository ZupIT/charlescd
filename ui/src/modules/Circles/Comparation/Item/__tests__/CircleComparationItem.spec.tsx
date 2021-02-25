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
import { AllTheProviders } from "unit-test/testUtils";
import { FetchMock } from 'jest-fetch-mock/types';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import { Actions, Subjects } from 'core/utils/abilities';
import CirclesComparationItem from '..';
import * as DatasourceHooks from 'modules/Settings/Credentials/Sections/MetricProvider/hooks';
import { COLOR_COMET } from 'core/assets/colors';

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

const circleWithoutDeployment = {
  name: 'Circle',
  deployment: {}
}

const defaultCircle = {
  name: 'Default',
  deployment: {
    status: 'DEPLOYED'
  }
}

const defaultCircleWithoutDeployment = {
  name: 'Default',
  deployment: {}
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
  const useGlobalStateSpy = jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123-workspace',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));

  const useDatasourceSpy = jest.spyOn(DatasourceHooks, 'useDatasource').mockReturnValueOnce({
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
    expect(screen.getByTestId('layer-metrics-groups')).toBeInTheDocument();
    expect(screen.getByText('Override release')).toBeInTheDocument();
    expect(screen.getByText('Last release deployed')).toBeInTheDocument();
  });

  useGlobalStateSpy.mockRestore();
  useDatasourceSpy.mockRestore();
});

test('should render CircleComparationItem with an Inactive Default Circle', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(defaultCircleWithoutDeployment))
    .mockResponseOnce(JSON.stringify(defaultCircleWithoutDeployment));
  const handleChange = jest.fn();

  render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  const dropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(dropdownIcon).toBeInTheDocument();

  act(() => userEvent.click(dropdownIcon));

  const dropdownActions = screen.getByTestId('dropdown-actions');

  await waitFor(() => {
    expect(dropdownActions).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item-undeploy-Undeploy')).not.toBeInTheDocument();
  });

  const iconEdit = await screen.findByTestId('icon-edit');
  expect(iconEdit).toBeInTheDocument();
  act(() => userEvent.click(iconEdit));

  const iconBack = await screen.findByTestId('icon-arrow-left');
  expect(iconBack).toBeInTheDocument();
});

test('should not disable delete button and show tooltip when is an Inactive Circle (i.e., not a Default Circle)', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(circleWithoutDeployment))
    .mockResponseOnce(JSON.stringify(circleWithoutDeployment));
  const handleChange = jest.fn();

  render(
    <AllTheProviders>
      <CirclesComparationItem id={props.id} onChange={handleChange} />
    </AllTheProviders>
  );

  const dropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(dropdownIcon).toBeInTheDocument();
  act(() => userEvent.click(dropdownIcon));

  const deleteButton = await screen.findByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();

  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).not.toHaveStyle(`color: ${COLOR_COMET}`);

  await act(async () => userEvent.click(deleteButton));
  const deleteCircleModal = screen.getByTestId('modal-trigger');
  expect(deleteCircleModal).toBeInTheDocument();

  userEvent.hover(deleteButton);
  expect(screen.queryByText('Active circle cannot be deleted,')).not.toBeInTheDocument();
  expect(screen.queryByText('you can undeploy first and then')).not.toBeInTheDocument();
  expect(screen.queryByText('delete this circle.')).not.toBeInTheDocument();
});

test('should disable delete button and show tooltip when is an Active Default Circle', async () => {
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
    .mockResponseOnce(JSON.stringify(defaultCircle))
    .mockResponseOnce(JSON.stringify(defaultCircle));
  const handleChange = jest.fn();

  render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  const DropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(DropdownIcon).toBeInTheDocument();
  act(() => userEvent.click(DropdownIcon));

  const deleteButton = await screen.findByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();

  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).toHaveStyle(`color: ${COLOR_COMET}`);

  userEvent.hover(deleteButton);
  expect(screen.getByText('Default circle is deployed to all')).toBeInTheDocument();
  expect(screen.getByText('users, so it cannot be deleted.')).toBeInTheDocument();
});

test('should disable delete button and show tooltip when is an Inactive Default Circle', async () => {
  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(defaultCircleWithoutDeployment))
    .mockResponseOnce(JSON.stringify(defaultCircleWithoutDeployment));
  const handleChange = jest.fn();

  render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  const dropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(dropdownIcon).toBeInTheDocument();

  act(() => userEvent.click(dropdownIcon));

  const deleteButton = await screen.findByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();

  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).toHaveStyle(`color: ${COLOR_COMET}`);

  userEvent.hover(deleteButton);
  expect(screen.getByText('Default circle cannot be deleted.')).toBeInTheDocument();
});

test('should disable delete button and show tooltip when is an Active Circle (i.e., not a Default Circle)', async () => {
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

  const dropdownIcon = await screen.findByTestId('icon-vertical-dots');
  expect(dropdownIcon).toBeInTheDocument();
  act(() => userEvent.click(dropdownIcon));

  const deleteButton = await screen.findByTestId('dropdown-item-delete-Delete');
  expect(deleteButton).toBeInTheDocument();

  const deleteButtonText = await screen.findByText('Delete');
  expect(deleteButtonText).toHaveStyle(`color: ${COLOR_COMET}`);

  userEvent.hover(deleteButton);
  expect(screen.getByText('Active circle cannot be deleted,')).toBeInTheDocument();
  expect(screen.getByText('you can undeploy first and then')).toBeInTheDocument();
  expect(screen.getByText('delete this circle.')).toBeInTheDocument();
});
