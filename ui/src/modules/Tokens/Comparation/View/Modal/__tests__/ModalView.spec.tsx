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

import { render, screen } from 'unit-test/testUtils';
import ModalView, {Props} from '../';

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