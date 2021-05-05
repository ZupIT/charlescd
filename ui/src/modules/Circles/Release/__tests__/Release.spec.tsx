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
import { render, screen, act } from 'unit-test/testUtils';
import Release from '../index';

test('should render the CreateRelease component', async () => {
  render(
    <Release id="1" onGoBack={() => {}} onCreateRelease={() => {}} />
  );

  const RadioButtonCreate = await screen.findByTestId("radio-group-type-item-create");
  act(() => userEvent.click(RadioButtonCreate));

  const CreateContent = await screen.findByTestId('create-release');
  expect(CreateContent).toBeInTheDocument();

  const SubmitCreate = await screen.findByTestId('button-default-submit');
  expect(SubmitCreate).toHaveStyle('margin-top: 20px;');
  expect(SubmitCreate).toBeInTheDocument();
});

test('should render the SearchRelease component', async () => {
  render(
    <Release id="1" onGoBack={() => {}} onCreateRelease={() => {}} />
  );

  const RadioButtonSearch = await screen.findByTestId("radio-group-type-item-search");
  act(() => userEvent.click(RadioButtonSearch));

  const SearchContent = await screen.findByTestId('search-release');
  expect(SearchContent).toBeInTheDocument();

  const SubmitSearch = await screen.findByTestId('button-default-submit');
  expect(SubmitSearch).toHaveStyle('margin-top: 20px;');
  expect(SubmitSearch).toBeInTheDocument();
});

test('should trigger goBack fn', async () => {
  const goBack = jest.fn();

  render(
    <Release id="1" onGoBack={goBack} onCreateRelease={() => {}} />
  );

  const ButtonGoBack = await screen.findByTestId('icon-arrow-left');
  act(() => userEvent.click(ButtonGoBack));

  expect(goBack).toBeCalled();
});