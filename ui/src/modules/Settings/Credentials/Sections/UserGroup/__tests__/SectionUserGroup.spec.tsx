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
import { saveProfile } from 'core/utils/profile';
import { getProfileByKey } from 'core/utils/profile';
import find from 'lodash/find';
import {userGroups, userGroup} from './fixtures';
import SectionUserGroup from '../';

// const mockPush = jest.fn();

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useHistory: () => ({
//     push: jest.fn().mockImplementation(mockPush)
//   })
// }));

test('should remove a user group', async () => {
  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroups}
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

test('should remove a user group that I do not belong to', async () => {
  saveProfile({ id: '123', name: 'User', email: 'user@zup.com.br' });

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroups}
    />
  );

  const userGroupDevx = await screen.findByTestId('user-group-1');
  const removeIcon = userGroupDevx.querySelector('[data-testid="icon-cancel"]');
  

  userEvent.click(removeIcon);
  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();

  const userLoggedEmail = getProfileByKey('email');
  const loggedUserEmailNotInAnyUsergroup = find(userGroups, (usergroup) => {
    return find(usergroup.users, (user) => {
      return user.email === userLoggedEmail;
    });
  });

  expect(loggedUserEmailNotInAnyUsergroup).toBeUndefined();

  const confirmRemove = screen.getByTestId('button-default-continue');
  userEvent.click(confirmRemove);

  await waitFor(() => expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument());
  
  expect(screen.queryByText('devx user group')).not.toBeInTheDocument();
});

test('should remove a user group that I (maintainer) belong to, and be redirected to workspaces', async () => {
  saveProfile({ id: '123', name: 'user 1', email: 'user1@gmail.com' });

  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroups}
    />
  );

  const userGroupDevx = await screen.findByTestId('user-group-1');
  const removeIcon = userGroupDevx.querySelector('[data-testid="icon-cancel"]');
  

  userEvent.click(removeIcon);
  expect(screen.getByText('Do you want to remove this user group?')).toBeInTheDocument();

  const userLoggedEmail = getProfileByKey('email');
  const loggedUserEmailBelongsToSomeUsergroup = find(userGroups, (usergroup) => {
    return find(usergroup.users, (user) => {
      return user.email === userLoggedEmail;
    });
  });

  expect(loggedUserEmailBelongsToSomeUsergroup).not.toBeUndefined();

  const confirmRemove = screen.getByTestId('button-default-continue');
  userEvent.click(confirmRemove);

  await waitFor(() => expect(screen.queryByText('Do you want to remove this user group?')).not.toBeInTheDocument());
  
  expect(screen.queryByText('devx user group')).not.toBeInTheDocument();
  
  // await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/workspaces'));

  // TODO should be redirected to /workspaces
});

// TODO add
test('should remove a user group (I am a root user), and not be redirected to workspaces', () => {

});

test('should cancel removal of a user group', async () => {
  
  render(
    <SectionUserGroup 
      form=''
      setForm={() => jest.fn()}
      data={userGroups}
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

test('should render modal that confirms user group deletion', async () => {
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

test('should close modal', async () => {
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

test('should close modal when clicking outside modal', async () => {
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