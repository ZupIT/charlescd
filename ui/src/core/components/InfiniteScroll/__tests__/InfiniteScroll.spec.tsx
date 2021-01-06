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
import { render, screen } from 'unit-test/testUtils';
import InfiniteScroll from '../';

test('renders InfiniteScroll', () => {
  render(
    <InfiniteScroll
      hasMore={false}
      isLoading={false}
      loadMore={jest.fn()}
      loader={<div>loading...</div>}
    >
      <div>item 1</div>
    </InfiniteScroll>
  );

  const userLoader = screen.queryByTestId('user-loader');
  const sentinelLoader = screen.getByTestId('sentinel-loader');

  expect(userLoader).not.toBeInTheDocument();
  expect(sentinelLoader).toHaveStyle({ display: 'none' });
});

test('renders InfiniteScroll with user loader', () => {
  render(
    <InfiniteScroll
      hasMore={false}
      isLoading={true}
      loadMore={jest.fn()}
      loader={<div>loading...</div>}
    >
      <div>item 1</div>
    </InfiniteScroll>
  );

  const userLoader = screen.getByTestId('user-loader');
  const sentinelLoader = screen.getByTestId('sentinel-loader');

  expect(userLoader).toBeInTheDocument();
  expect(sentinelLoader).toHaveStyle({ display: 'none' });
});