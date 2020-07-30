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
import { FetchMock } from 'jest-fetch-mock/types';
import { Circle } from 'modules/Circles/interfaces/Circle';
import CreateSegments from '..';

(global as any).MutationObserver = MutationObserver

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
  const { getByText } = render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
    />
  );

  await wait(() => expect(getByText('Create manually')).toBeInTheDocument());
});
