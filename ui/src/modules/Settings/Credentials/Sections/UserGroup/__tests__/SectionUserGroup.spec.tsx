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
import { render, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import { FetchMock } from 'jest-fetch-mock';
import SectionUserGroup from '../';

test('should remove a user group', async () => {
  // TODO put in fixture
  const userGroup = [
    {
      id: '1',
      name: 'devx user group',
      users: [
        {
          id: '12',
          name: 'user 1',
          email: 'user1@gmail.com'
        }
      ]
    },
    {
      id: '2',
      name: 'metrics user group',
      users: [
        {
          id: '34',
          name: 'user 2',
          email: 'user2@gmail.com'
        }
      ]
    }
  ];

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroup}
    />
  );

  const userGroup1 = await screen.findByTestId('user-group-1');
  const removeIcon = userGroup1.querySelector('[data-testid="icon-cancel"]');

  userEvent.click(removeIcon);
  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();

  const confirmRemove = screen.getByTestId('button-default-continue');
  userEvent.click(confirmRemove);

  await waitFor(() => expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument());
  
  expect(screen.queryByText('devx user group')).not.toBeInTheDocument();
});

test.only('should cancel removal of a user group', async () => {
  // TODO put in fixture
  const userGroup = [
    {
      id: '1',
      name: 'devx user group',
      users: [
        {
          id: '12',
          name: 'user 1',
          email: 'user1@gmail.com'
        }
      ]
    },
    {
      id: '2',
      name: 'metrics user group',
      users: [
        {
          id: '34',
          name: 'user 2',
          email: 'user2@gmail.com'
        }
      ]
    }
  ];

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroup}
    />
  );

  const userGroup1 = await screen.findByTestId('user-group-1');
  const removeIcon = userGroup1.querySelector('[data-testid="icon-cancel"]');

  userEvent.click(removeIcon);
  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();

  const cancelRemove = screen.getByTestId('button-default-dismiss');
  userEvent.click(cancelRemove);

  await waitFor(() => expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument());
  
  expect(screen.getByText('devx user group')).toBeInTheDocument();
});


test.skip('should remove a user group OLD', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));
  saveProfile({
    id: 'profile',
    name: 'user1',
    email: 'user1@email'
  });
  render(<Credentials />);

  console.log('before', window.location);
  
  await waitFor(() => expect(screen.getByText('devx')).toBeInTheDocument());
  const userGroup = await screen.findByTestId('user-group-ug-1');
  const iconCancel = userGroup.querySelector('[data-testid="icon-cancel"]');

  userEvent.click(iconCancel);
  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();
  const confirmButton = await screen.findByText('Yes, remove user group');

  userEvent.click(confirmButton);
  await waitFor(() => expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument());
  expect(screen.queryByText('devx')).not.toBeInTheDocument();

  await waitFor(() => {});
  console.log('after', window.location);
});

test.skip('should render modal that confirms user group deletion', async () => {
  const userGroup = [
    {
      id: '1',
      name: 'devx',
      users: [
        {
          id: '12',
          name: 'user 1',
          email: 'user1@gmail.com'
        }
      ]
    }
  ];

  const modalDescription = "When you remove a user group, all the users associated to the group will no longer access the workspace. Do you want to continue?"

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroup}
    />
  );

  const cancelIcon = screen.getByTestId('icon-cancel');
  userEvent.click(cancelIcon);

  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();
  expect(screen.getByText(modalDescription)).toBeInTheDocument();
  expect(screen.getByText('Yes, remove user group')).toBeInTheDocument();
  expect(screen.getByText('Cancel, keep user group')).toBeInTheDocument();
  expect(screen.getByTestId('icon-close-modal')).toBeInTheDocument();
});

test.skip('should close modal', async () => {
  const userGroup = [
    {
      id: '1',
      name: 'devx',
      users: [
        {
          id: '12',
          name: 'user 1',
          email: 'user1@gmail.com'
        }
      ]
    }
  ];

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroup}
    />
  );

  const cancelIcon = screen.getByTestId('icon-cancel');
  userEvent.click(cancelIcon);

  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();
  const closeModalIcon = screen.getByTestId('icon-close-modal');
  userEvent.click(closeModalIcon);
  
  expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument();
});

test.skip('should close modal when clicking outside modal', async () => {
  const userGroup = [
    {
      id: '1',
      name: 'devx',
      users: [
        {
          id: '12',
          name: 'user 1',
          email: 'user1@gmail.com'
        }
      ]
    }
  ];

  render(
    <div data-testid="wrapper-modal">
      <SectionUserGroup 
        form=''
        setForm={() => jest.fn()}
        data={userGroup}
      />
    </div>
  );

  const cancelIcon = screen.getByTestId('icon-cancel');
  userEvent.click(cancelIcon);

  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();
  
  const modalWrapper = screen.getByTestId('wrapper-modal');
  userEvent.click(modalWrapper);
  expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument();
});