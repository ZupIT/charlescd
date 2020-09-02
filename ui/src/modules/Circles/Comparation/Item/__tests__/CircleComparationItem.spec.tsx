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
import { render, wait, fireEvent } from 'unit-test/testUtils';
import MutationObserver from 'mutation-observer'
import { AllTheProviders } from "unit-test/testUtils";
import CirclesComparationItem from '..';
import { FetchMock } from 'jest-fetch-mock';
import { Actions, Subjects } from 'core/utils/abilities';

(global as any).MutationObserver = MutationObserver

interface fakeCanProps {
  I?: Actions;
  a?: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  allowedRoutes?: boolean;
  children: ReactElement;
}

jest.mock('core/components/Can', () => {
  return {
    __esModule: true,
    default:  ({children}: fakeCanProps) => {
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

  const { getByTestId } = render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  await wait();

  expect(getByTestId(`circle-comparation-item-${props.id}`)).toBeInTheDocument();
  expect(getByTestId(`tabpanel-Untitled`)).toBeInTheDocument();
});

test('render CircleComparationItem with release', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({})).mockResponseOnce(JSON.stringify(circle));
  const handleChange = jest.fn();

  const { getByText, getByTestId } = render(
    <AllTheProviders>
      <CirclesComparationItem id={props.id} onChange={handleChange} />
    </AllTheProviders>
  );

  await wait();

  expect(getByTestId('layer-metrics')).toBeInTheDocument();
  expect(getByTestId('layer-metrics-groups')).toBeInTheDocument();
  expect(getByText('Override release')).toBeInTheDocument();
  expect(getByText('Last release deployed')).toBeInTheDocument();
  expect(getByText('Add Metrics Configuration')).toBeInTheDocument();
});

test('render CircleComparationItem Default Circle', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'Default', deployment: {} }));
  const handleChange = jest.fn();

  const { queryByTestId, getByTestId } = render(
    <CirclesComparationItem id={props.id} onChange={handleChange} />
  );

  await wait();

  const DropdownIcon = getByTestId('icon-vertical-dots');
  await wait(() => expect(DropdownIcon).toBeInTheDocument());

  fireEvent.click(DropdownIcon);

  const DropdownActions = getByTestId('dropdown-actions');
  await wait(() => expect(DropdownActions).toBeInTheDocument());

  await wait(() => expect(queryByTestId('dropdown-item-undeploy-Undeploy')).not.toBeInTheDocument());
  await wait(() => expect(queryByTestId('layer-metrics')).not.toBeInTheDocument());
});
