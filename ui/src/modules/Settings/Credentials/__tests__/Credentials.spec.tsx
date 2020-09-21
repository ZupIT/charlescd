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

import React from 'react';
import MutationObserver from 'mutation-observer'
import { render, fireEvent, wait, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import Credentials from '..';

(global as any).MutationObserver = MutationObserver

test('render Credentials default component', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'workspace' }));
  const { getByTestId } = render(
    <Credentials />
  );

  await wait();

  expect(getByTestId("credentials")).toBeInTheDocument();
});

test('render Credentials items', async () => {
  (fetch as FetchMock).mockResponseOnce(JSON.stringify({ name: 'workspace' }));
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  expect(screen.queryByTestId('contentIcon-workspace'));
  expect(screen.queryByTestId('contentIcon-users'));
  expect(screen.queryByTestId('contentIcon-git'));
  expect(screen.queryByTestId('contentIcon-server'));
  expect(screen.queryByTestId('contentIcon-cd-configuration'));
  expect(screen.queryByTestId('contentIcon-circle-matcher'));
  expect(screen.queryByTestId('contentIcon-metrics'));
});

test('render User Group credentials', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  const content = screen.queryByTestId('contentIcon-users');
  const buttonOpenUsersGroup = content.nextElementSibling.querySelector('button');
  fireEvent.click(buttonOpenUsersGroup);

  await wait(() => screen.getByTestId('icon-arrow-left'));
  const buttonBack = screen.queryByTestId('icon-arrow-left');

  expect(buttonBack).toBeInTheDocument();
  fireEvent.click(buttonBack);
  const arrow = screen.queryByTestId('icon-arrow-left');
  await wait(() => expect(arrow).not.toBeInTheDocument());
});

test('render Git Credentials', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  const content = screen.queryByTestId('contentIcon-git');
  const button = content.nextElementSibling.querySelector('button');
  await wait(() => fireEvent.click(button));
  const buttonBack = screen.queryByTestId('icon-arrow-left');

  expect(buttonBack).toBeInTheDocument();
});

test('render CD Configuration Credentials', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  const content = screen.queryByTestId('contentIcon-cd-configuration');
  const button = content.nextElementSibling.querySelector('button');
  await wait(() => fireEvent.click(button));
  const buttonBack = screen.queryByTestId('icon-arrow-left');

  expect(buttonBack).toBeInTheDocument();
});

test('render Circle Matcher Credentials', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  const content = screen.queryByTestId('contentIcon-circle-matcher');
  const button = content.nextElementSibling.querySelector('button');
  await wait(() => fireEvent.click(button));
  const buttonBack = screen.queryByTestId('icon-arrow-left');

  expect(buttonBack).toBeInTheDocument();
});

test('click to copy to clipboard', async () => {
  jest.spyOn(StateHooks, 'useGlobalState').mockImplementation(() => ({
    item: {
      id: '123',
      status: WORKSPACE_STATUS.COMPLETE
    },
    status: 'resolved'
  }));
  render(<Credentials />);
  
  const content = screen.queryByTestId('contentIcon-circle-matcher');
  const button = content.nextElementSibling.querySelector('button');
  await wait(() => fireEvent.click(button));
  const buttonBack = screen.queryByTestId('icon-arrow-left');

  expect(buttonBack).toBeInTheDocument();
});