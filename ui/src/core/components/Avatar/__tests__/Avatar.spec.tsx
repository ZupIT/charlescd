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
import Avatar from '../';

const profile = {
  size: '10px',
  profile: {
    name: 'Charles',
    email: 'charles@zup.com.br',
  }
}

test('render Avatar with photo', () => {
  const props = { ...profile, photoUrl: 'https://photo.png' };

  render(<Avatar { ...props } />);

  const element = screen.getByTestId('avatar')
  expect(element).toHaveStyle(`width: ${profile.size};`);
});

test('render Avatar with initial content', () => {
  render(<Avatar { ...profile } />);

  const element = screen.getByText('C');
  expect(element).toBeInTheDocument();
});

test('render Avatar and click to edit', () => {
  render(<Avatar {...profile} />);

  const element = screen.getByTestId('avatar')
  expect(element).toHaveStyle(`width: ${profile.size};`);

  const editIcon = screen.getByTestId('icon-edit-avatar');
  userEvent.click(editIcon);

  const inputURL = screen.getByTestId('input-text-photoUrl');
  expect(inputURL).toBeInTheDocument();
});