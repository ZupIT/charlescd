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
import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import ResultList from '../ResultList';
import * as PathUtils from 'core/utils/path';

const circleMatcherResultList = [
  {
    id: '1',
    name: 'circle 1'
  },
  {
    id: '2',
    name: 'circle 2'
  }
]


test('render ResultList', async () => {
  render(<ResultList isLoading={false} circles={circleMatcherResultList} />);

  expect(screen.queryByTitle('Loading...')).not.toBeInTheDocument();
  expect(screen.getByText('Result:')).toBeInTheDocument();
  expect(screen.getByText('circle 1')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('circle 2')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
});

test('render ResultList when is loading', async () => {
  render(<ResultList isLoading circles={[]} />);

  expect(screen.getByTitle('Loading...')).toBeInTheDocument();
  expect(screen.getByText('Result:')).toBeInTheDocument();
});


test('render ResultList and trigger View action', async () => {
  const addParamSpy = jest.spyOn(PathUtils, 'addParam');

  render(<ResultList isLoading={false} circles={circleMatcherResultList} />);

  const viewButton = screen.getAllByText('View');
  expect(viewButton).toHaveLength(2);
  userEvent.click(viewButton[0]);

  expect(addParamSpy).toHaveBeenCalled();
});
