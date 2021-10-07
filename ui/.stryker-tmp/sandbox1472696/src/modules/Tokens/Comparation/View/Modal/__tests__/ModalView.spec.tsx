// @ts-nocheck
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

import { render, screen, waitFor } from 'unit-test/testUtils';
import ModalView, {Props} from '../';
import 'unit-test/setup-msw';

const props: Props = {
  allWorkspaces: false,
  tokenWorkspaces: ['workspace 1', 'workspace 2'],
  onClose: jest.fn(),
}

test('should render modal view workspaces', () => {
  render(<ModalView {...props} />);

  expect(screen.getByText('View workspaces')).toBeInTheDocument();
  expect(screen.getByLabelText('Filter workspaces')).toBeInTheDocument();
  expect(screen.getByTestId('workspace-list-content')).toBeInTheDocument();
});

test('should render modal view workspaces, when allWorkspaces is true', async () => {
  render(<ModalView allWorkspaces={true} tokenWorkspaces={[]} onClose={jest.fn()} />);

  expect(screen.getByText('View workspaces')).toBeInTheDocument();
  expect(screen.getByLabelText('Filter workspaces')).toBeInTheDocument();
  expect(screen.getByTestId('workspace-list-content')).toBeInTheDocument();
  
  expect(screen.getByTestId('modal-list-loader')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText('12')).toBeInTheDocument());
  
  await waitFor(() => expect(screen.queryByTestId('modal-list-loader')).not.toBeInTheDocument());
});