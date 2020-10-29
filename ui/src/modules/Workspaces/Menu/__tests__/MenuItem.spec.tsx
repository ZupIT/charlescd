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
import { render, screen, wait, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
// import * as authUtils from 'core/utils/auth';
// import * as WorkspaceHooks from '../hooks';
// import MutationObserver from 'mutation-observer';
import { workspaceItem } from './fixtures';
import WorkspaceItem from '../MenuItem';

test('render Workspace item', async () => {
  render(
    <WorkspaceItem  
      id={workspaceItem.id}
      name={workspaceItem.name}
      status={workspaceItem.status}
      selectedWorkspace={null}
    />
  );

  const workspaceName = screen.getByText('workspace');

  expect(workspaceName).toBeInTheDocument();
});

// test.only('render Workspace item and click', async () => {
//   render(
//     <WorkspaceItem  
//       id={workspaceItem.id}
//       name={workspaceItem.name}
//       status={workspaceItem.status}
//       selectedWorkspace={null}
//     />
//   );

//   const workspaceName = screen.getByText('workspace');

//   expect(workspaceName).toBeInTheDocument();

//   // const button = screen.getByTestId('button-default-workspaceModal');
//   // fireEvent.click(button);

//   // await wait(() => expect(screen.queryByTestId('modal-default')).toBeInTheDocument());
  
//   // const cancelButton = screen.getByTestId('icon-cancel');
//   // fireEvent.click(cancelButton);
//   // await wait(() => expect(screen.queryByTestId('modal-default')).not.toBeInTheDocument());
// });

//TO-DO Test wotkspace looking in the local storage
