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
import { render, fireEvent, wait, waitForDomChange } from 'unit-test/testUtils';
import RadioGroup from '../';

const props = {
  name: 'git',
  radios: [
    { icon: 'github', value: 'GitHub' },
    { icon: 'gitlab', value: 'GitLab' }
  ]
}

test('render RadioGroup default component', async () => {
  const onChange = jest.fn();
  const { queryByTestId } = render(
    <RadioGroup
      name={props.name}
      items={props.radios}
      onChange={onChange}
    />
  );

  const githubElement = queryByTestId(`radio-group-${props.name}-item-${props.radios[0].value}`);
  const gitlabElement = queryByTestId(`radio-group-${props.name}-item-${props.radios[1].value}`);

  await wait();

  expect(githubElement).toBeInTheDocument();
  expect(gitlabElement).toBeInTheDocument();
});

test('render RadioGroup and trigger event', () => {
  const onChange = jest.fn();
  const { queryByTestId } = render(
    <RadioGroup
      name={props.name}
      items={props.radios}
      onChange={onChange}
    />
  );

  const value = props.radios[0].value;
  const element = queryByTestId(`radio-group-${props.name}-item-${value}`) as HTMLInputElement;

  fireEvent.change(element, { currentTarget: { value }});

  wait(() => expect(onChange).toHaveBeenCalledWith(value));
});