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
import MutationObserver from 'mutation-observer'
import { render, wait } from 'unit-test/testUtils';
import Segments from '..';

(global as any).MutationObserver = MutationObserver

test('render Segments default component', async () => {
  const { getByTestId, queryByTestId } = render(
    <Segments />
  );

  expect(queryByTestId('segments-rules')).not.toBeInTheDocument();
  expect(getByTestId('input-text-logicalOperator')).toBeInTheDocument();
  expect(queryByTestId('input-hidden-type')).toBeInTheDocument();
  expect(queryByTestId('button-default-save')).not.toBeInTheDocument();
});

test('render Segments default component with viewMode off', async () => {
  const { getByTestId } = render(
    <Segments viewMode={false} />
  );

  expect(getByTestId('segments-rules')).toBeInTheDocument();
  expect(getByTestId('input-text-logicalOperator')).toBeInTheDocument();
  expect(getByTestId('button-default-save')).toBeInTheDocument();
});
