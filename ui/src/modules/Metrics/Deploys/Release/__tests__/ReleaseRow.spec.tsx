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
import ReleaseRow from '../ReleaseRow';
import { render, screen, wait, fireEvent } from 'unit-test/testUtils';
import { ReleaseContentMock } from './fixtures';

test('render default Release Row', async () => {

 render(
   <ReleaseRow release={ReleaseContentMock}/>
 );

 await wait();

 expect(screen.getByTestId('release-table-row-1')).toBeInTheDocument();
 expect(screen.getByText('release 1')).toBeInTheDocument();
 expect(screen.getByText('circle 1')).toBeInTheDocument();
 expect(screen.getByText('1:13 m')).toBeInTheDocument();
 expect(screen.getByText('Jhon Doe')).toBeInTheDocument();
});

test('render Components Row', async () => {
  render(
    <ReleaseRow release={ReleaseContentMock}/>
  );
 
  await wait();

 const release = screen.getByTestId('release-table-row-1');
 fireEvent.click(release);

 expect(screen.getAllByText(/module a/)).toHaveLength(2);
});

