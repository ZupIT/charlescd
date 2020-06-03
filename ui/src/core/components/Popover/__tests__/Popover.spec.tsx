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
import Popover, { Props } from '../';

let props: Props = {
  icon: 'info',
  title: 'Git',
  description: 'With access to Git..',
  link: '#',
  linkLabel: 'view-documentation'
};

test('render Popover with required props', async () => {
  const { queryByTestId } = render(
    <Popover title={props.title} icon={props.icon} description={props.description} />
  );

  await wait();

  const element = queryByTestId(`popover-${props.title}`);
  const triggerElement = queryByTestId(`icon-${props.icon}`);
  expect(triggerElement).toBeInTheDocument();
  expect(element).not.toBeInTheDocument();
});

test('render Popover with required props and trigger', async () => {
  const { queryByTestId } = render(
    <Popover title={props.title} icon={props.icon} description={props.description} />
  );

  const triggerElement = queryByTestId(`icon-${props.icon}`);
  fireEvent.click(triggerElement);

  await wait();
  
  const element = queryByTestId(`popover-${props.title}`);

  expect(triggerElement).toBeInTheDocument();
  expect(element).toBeInTheDocument();
});

test('render Popover with link prop', async () => {
  const { queryByText, queryByTestId } = render(
    <Popover title={props.title} icon={props.icon} description={props.description} linkLabel={props.linkLabel} link={props.link} />
  );
  
  const triggerElement = queryByTestId(`icon-${props.icon}`);
  fireEvent.click(triggerElement);

  await wait();
  
  const linkLabelElement = queryByText(props.linkLabel);
  expect(linkLabelElement).toBeInTheDocument();
});
