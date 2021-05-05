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

import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock/types';
import { act, render, screen, waitFor } from 'unit-test/testUtils';
import Search, { Props } from '..';

const props: Props = {
  circleId: '123',
  onDeployed: jest.fn()
}

test('should render component', () => {
  render(<Search {...props} />);

  const Element = screen.queryByTestId('search-release');
  expect(Element).toBeInTheDocument();
});

test('should render component and submit', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  render(<Search {...props} />);

  const SubmitButton = await screen.findByTestId('button-default-submit');
  expect(SubmitButton).toBeInTheDocument();
  
  act(() => userEvent.click(SubmitButton));
  waitFor(() => expect(props.onDeployed).toBeCalled());
});
