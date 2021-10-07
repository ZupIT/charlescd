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
import { render, screen, fireEvent } from 'unit-test/testUtils';
import Release from '../index';

test('should render the CreateRelease component', () => {
  render(
    <Release id="1" onGoBack={() => {}} onCreateRelease={() => {}} />
  );

  const createButton = screen.getByTestId("radio-group-type-item-create");
  fireEvent.click(createButton);

  const release = screen.getByTestId('create-release');
  expect(release).toBeInTheDocument();
});

test('should render the SearchRelease component', () => {
  render(
    <Release id="1" onGoBack={() => {}} onCreateRelease={() => {}} />
  );

  const searchButton = screen.getByTestId("radio-group-type-item-search");
  fireEvent.click(searchButton);

  const release = screen.getByTestId('search-release');
  expect(release).toBeInTheDocument();
});

test('should trigger goBack fn', () => {
  const goBack = jest.fn();

  render(
    <Release id="1" onGoBack={goBack} onCreateRelease={() => {}} />
  );

  const goBackBtn = screen.getByTestId('icon-arrow-left');
  fireEvent.click(goBackBtn);

  expect(goBack).toBeCalled();
});