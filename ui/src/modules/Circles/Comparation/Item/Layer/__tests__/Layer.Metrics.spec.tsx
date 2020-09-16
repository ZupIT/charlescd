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
import { render, screen } from 'unit-test/testUtils';
import * as StateHooks from 'core/state/hooks';
import { WORKSPACE_STATUS } from 'modules/Workspaces/enums';
import * as workspaceUtils from 'core/utils/workspace';
import LayerMetrics from '../Metrics';

test('render Layer Metrics with  circles metrics', () => {
  const workspaceID = '1234-workspace';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceID);
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.COMPLETE,
        metricConfiguration: { id: '' }
      },
      status: 'resolved'
    });
  render(<LayerMetrics id="123" />);
  expect(screen.queryByTestId('apexcharts-mock')).toBeInTheDocument();
});

test('render Layer Metrics with button to add metrics', async () => {
  const workspaceID = '1234-workspace';
  jest.spyOn(workspaceUtils, 'getWorkspaceId').mockReturnValue(workspaceID);
  jest.spyOn(StateHooks, 'useGlobalState')
    .mockReturnValueOnce({
      item: {
        id: workspaceID,
        status: WORKSPACE_STATUS.COMPLETE
      },
      status: 'idle'
    });
  render(<LayerMetrics id="123" />);
  expect(screen.queryByTestId('button-iconRounded-add')).not.toBeInTheDocument();
});