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
import Section, { Props } from '..';

test('render Section default component', async () => {
  const props: Props = {
    name: 'git',
    icon: 'git',
    showAction: true,
    action: () => {}
  }

  const { queryByTestId } = render(
    <Section
      name={props.name}
      icon={props.icon}
      action={props.action}
      showAction={props.showAction}
    />
  );
  
  await wait();

  expect(queryByTestId(`icon-add`)).toBeInTheDocument();
  expect(queryByTestId(`contentIcon-${props.name}`)).toBeInTheDocument();
});

test('render Section default component with children', async () => {
  const props: Props = {
    name: 'git',
    icon: 'git',
    children: 'children',
    showAction: false,
    action: () => {}
  }

  const { queryByTestId, getByText } = render(
    <Section
      name={props.name}
      icon={props.icon}
      action={props.action}
      showAction={props.showAction}
    >
      {props.children}
    </Section>
  );
  
  await wait();

  expect(queryByTestId('icon-add')).not.toBeInTheDocument();
  expect(queryByTestId(`contentIcon-${props.name}`)).toBeInTheDocument();
  expect(getByText("children")).toBeInTheDocument();
});
