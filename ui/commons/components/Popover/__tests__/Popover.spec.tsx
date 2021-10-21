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
import userEvent from '@testing-library/user-event';
import Popover, { Props } from '../';

let props: Props = {
  icon: 'info',
  title: 'Git',
  description: 'With access to Git..',
  link: '#',
  linkLabel: 'view-documentation'
};

test('render Popover with required props', () => {
  render(
    <Popover title={props.title} icon={props.icon} description={props.description} />
  );

  const popoverElement = screen.queryByTestId(`popover-${props.title}`);
  const triggerElement = screen.getByTestId(`icon-${props.icon}`);

  expect(triggerElement).toBeInTheDocument();
  expect(popoverElement).not.toBeInTheDocument();
});

test('render Popover with required props and trigger', () => {
  render(
    <Popover title={props.title} icon={props.icon} description={props.description} />
  );

  const triggerElement = screen.getByTestId(`icon-${props.icon}`);
  userEvent.click(triggerElement);
  
  const popoverElement = screen.getByTestId(`popover-${props.title}`);

  expect(triggerElement).toBeInTheDocument();
  expect(popoverElement).toBeInTheDocument();
});

test('render Popover with link prop', () => {
  render(
    <Popover 
      title={props.title} 
      icon={props.icon} 
      description={props.description} 
      linkLabel={props.linkLabel} 
      link={props.link} 
    />
  );
  
  const triggerElement = screen.getByTestId(`icon-${props.icon}`);
  userEvent.click(triggerElement);
  
  const linkLabelElement = screen.getByText(props.linkLabel);
  expect(linkLabelElement).toBeInTheDocument();
});
