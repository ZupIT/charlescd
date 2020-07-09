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
import { render, wait } from 'unit-test/testUtils';
import Can from '..';

test('renders ContentIcon component with default properties', async () => {
  const props = {
    key: 'can-test',
    children: <p>test</p>,
    isdisabled: false
  };

  const { queryByText, debug } = render(
    <Can key={props.key} I="read" a="deploy" passThrough isDisabled={props.isdisabled}>
      {props.children}
    </Can>
  );
  const component = queryByText('test');
  expect(component).toBeInTheDocument();
});
