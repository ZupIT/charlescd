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
import { MemoryRouter } from 'react-router-dom';
import Token from '../index';
import 'unit-test/setup-msw';
import routes from 'core/constants/routes';

test('render Token PlaceHolder', async () => {
  render(
    <MemoryRouter initialEntries={[routes.tokens]}>
      <Token />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.queryByText('TOKEN 1')).toBeInTheDocument());
  expect(screen.getByTestId('placeholder-empty-groups')).toBeInTheDocument();
});