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
import ButtonIconRounded from '../';

test('render ButtonIconRounded default component', () => {
  const click = jest.fn();
  const props = {
    name: 'add',
    icon: 'add',
    children: 'button'
  };
  render(
    <ButtonIconRounded onClick={click} name={props.name} icon={props.name}>
      {props.children}
    </ButtonIconRounded>
  );
  const button = screen.getByTestId(`button-iconRounded-${props.name}`);
  const iconAdd = screen.getByTestId(`icon-${props.name}`);

  expect(iconAdd).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  userEvent.click(button);
  expect(click).toBeCalled();
});

test('render ButtonIconRounded default component without default props', () => {
  const click = jest.fn();
  const props = {
    name: 'add',
    icon: 'add',
    children: 'button'
  };
  render(
    <ButtonIconRounded
      onClick={click}
      name={props.name}
      icon={props.name}
      size="small"
      backgroundColor="primary"
    >
      {props.children}
    </ButtonIconRounded>
  );
  const button = screen.getByTestId(`button-iconRounded-${props.name}`);
  const iconAdd = screen.getByTestId(`icon-${props.name}`);

  expect(iconAdd).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  userEvent.click(button);
  expect(click).toBeCalled();
});

test('render ButtonIconRounded on loading mode', () => {
  const click = jest.fn();
  const props = {
    name: 'add',
    icon: 'add',
    children: 'button'
  };
  render(
    <ButtonIconRounded
      onClick={click}
      name={props.name}
      icon={props.name}
      isLoading={true}
    >
      {props.children}
    </ButtonIconRounded>
  );
  const button = screen.getByTestId(`button-iconRounded-${props.name}`);
  const iconLoading = screen.getByTestId('icon-loading');

  expect(button).toBeInTheDocument();
  expect(iconLoading).toBeInTheDocument();
});