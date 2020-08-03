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
import { render, fireEvent, wait } from 'unit-test/testUtils';
import SummaryRelease from '../SummaryRelease';

test('render default Summary Release', async () => {
  const { getByText, getByTestId } = render(
    <SummaryRelease isLoading={false}  />
  );
  
  expect(getByTestId('summary-release')).toBeInTheDocument();
  expect(getByText('Deployed')).toBeInTheDocument();
  expect(getByText('Error')).toBeInTheDocument();
});

test('render Summary Release when is loading', async () => {
  const { getByTestId  } = render(
    <SummaryRelease isLoading />
  );

  const loaderWrapper = getByTestId('loader-legend-release');
  const loading = loaderWrapper.querySelector('svg');
  expect(loading).toBeTruthy();
});
