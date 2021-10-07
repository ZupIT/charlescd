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

import React from 'react';
import { render, fireEvent, waitFor } from 'unit-test/testUtils';
import Summary from '../Summary';

test('render default Summary', async () => {
  const { getByText, getByTestId } = render(
    <Summary isLoading={false} onSearch={() => null} />
  );

  expect(getByText('Active')).toBeInTheDocument();
  expect(getByText('Inactive')).toBeInTheDocument();
  expect(getByTestId('input-text-search')).toBeInTheDocument();
});


test('should check if onSearch is called', async () => {
  const onSearch = jest.fn();
  const { getByTestId  } = render(
    <Summary isLoading={false} onSearch={onSearch} />
  );
  const inputSearch = getByTestId('input-text-search');
  const value = 'foobar';

  fireEvent.change(inputSearch, { target: { value }});

  await waitFor(() => expect(onSearch).toHaveBeenCalledWith(value));
});

test('render Summary when is loading', async () => {
  const { getByTestId  } = render(
    <Summary isLoading onSearch={() => null} />
  );

  const loaderWrapper = getByTestId('loader-legend');
  const loading = loaderWrapper.querySelector('svg');
  expect(loading).toBeTruthy();
});
