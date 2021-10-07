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
// @ts-nocheck


import React from 'react';
import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { circleData, newCircleData } from './fixtures';
import MetricsGroups from '../MetricsGroups';
import { saveProfile } from 'core/utils/profile';
import { setUserAbilities } from 'core/utils/abilities';
import { saveWorkspace } from 'core/utils/workspace';

test('render Metrics Groups Layer without data', async () => {
  saveWorkspace({id: '1', name: 'workspace 1', status: 'COMPLETE'});
  saveProfile({ id: '123', name: 'charles admin', email: 'charlesadmin@admin', root: true});
  setUserAbilities();

  const handleClick = jest.fn();

  render(<MetricsGroups circleId={'1'} onClickCreate={handleClick} circle={circleData}/>);

  const addMetricsGroups = screen.getByTestId('button-iconRounded-add');
  expect(addMetricsGroups).toBeInTheDocument();

  expect(screen.getByTestId('layer-metrics-groups')).toBeInTheDocument();
  expect(screen.getByText('Metrics Groups')).toBeInTheDocument();

  await act(async () => userEvent.click(addMetricsGroups));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('render Metrics Groups Layer without any circle data', async () => {
  saveWorkspace({id: '1', name: 'workspace 1', status: 'COMPLETE'});
  saveProfile({ id: '123', name: 'charles admin', email: 'charlesadmin@admin', root: false});
  setUserAbilities();

  const handleClick = jest.fn();

  render(<MetricsGroups circleId={'1'} onClickCreate={handleClick} circle={newCircleData}/>);

  const addMetricsGroups = screen.getByTestId('button-iconRounded-add');
  expect(addMetricsGroups).toBeInTheDocument();
  expect(addMetricsGroups).toBeDisabled();
});
