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
import { render, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import { Circle } from 'modules/Circles/interfaces/Circle';
import { ThemeScheme } from 'core/assets/themes';
import { getTheme } from 'core/utils/themes';
import CreateSegments from '..';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const theme = getTheme() as ThemeScheme;

const circle = {
  deployment: {
    status: 'DEPLOYED'
  }
}

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render CreateSegments default component', async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
    />
  );

  const ButtonGoBack = await screen.findByTestId('icon-arrow-left');
  expect(ButtonGoBack).toBeInTheDocument();

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();
});

test('render CreateSegments and try Create manually', async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
    />
  );

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();
  
  act(() => userEvent.click(ButtonCreateManually));

  expect(ButtonCreateManually).toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
  expect(ButtonImportCSV).not.toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
});

test('render CreateSegments and try Import CSV', async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
    />
  );

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  act(() => userEvent.click(ButtonImportCSV));

  waitFor(() => expect(ButtonImportCSV).toHaveStyle(`background-color: ${theme.radio.button.checked.background}`));
  expect(ButtonCreateManually).not.toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
});
