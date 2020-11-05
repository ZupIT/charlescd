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
import { fireEvent, render, screen } from 'unit-test/testUtils';
import Avatar from '../';

const profile = {
  size: '10px',
  profile: {
    name: 'Charles',
    email: 'charles@zup.com.br',
  }
}

test('render Avatar with photo', async () => {
  const props = { ...profile, photoUrl: 'https://photo.png' };

  render(<Avatar { ...props } />);

  const element = await screen.findByTestId('avatar')
  expect(element).toHaveStyle(`width: ${profile.size};`);
});

test('render Avatar with initial name as "profile photo"', async () => {
  render(<Avatar { ...profile } />);

  const element = await screen.findByTestId('avatar')
  expect(element.firstChild.textContent).toBe('C');
});

test('render Avatar and click to edit', async () => {
  render(<Avatar {...profile} />);

  const element = await screen.findByTestId('avatar')
  expect(element).toHaveStyle(`width: ${profile.size};`);

  const editIcon = await screen.findByTestId('icon-edit-avatar');
  fireEvent.click(editIcon);
  expect(screen.getByTestId('input-text-photoUrl')).toBeInTheDocument();
});
