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
import ReleaseComponentsTable from '../ReleaseComponentsTable';
import { render, screen, wait } from 'unit-test/testUtils';
import { releaseComponentsMock} from './fixtures';

test('render Components Row', async () => {
render(
   <ReleaseComponentsTable components={releaseComponentsMock}/>
 );

 await wait();

 expect(screen.getByText('module a1')).toBeInTheDocument();
 expect(screen.getByText('component a1')).toBeInTheDocument();
 expect(screen.getByText('1')).toBeInTheDocument();
 expect(screen.getByText('module a2')).toBeInTheDocument();
 expect(screen.getByText('component a2')).toBeInTheDocument();
 expect(screen.getByText('2')).toBeInTheDocument();
});

