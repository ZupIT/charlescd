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

import { renderHook, act } from '@testing-library/react-hooks';
import * as ActionNotification from 'core/components/Notification/state/actions';
import { waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { useUserGroup } from '../hooks';
import { UserGroup } from '../interfaces';
import { ALREADY_ASSOCIATED_CODE, ALREADY_ASSOCIATED_MESSAGE } from '../constants';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

const error404 = {
  status: 404,
  json: () => ({ message: 'Error' })
};

const error422 = {
  json: () => ({ code: ALREADY_ASSOCIATED_CODE, message: ALREADY_ASSOCIATED_MESSAGE })
};

const userGroup: UserGroup = {
  name: 'Charles',
};

test('to save new userGroup', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  const { result } = renderHook(() => useUserGroup());

  await act(async () => {
    await result.current.save(userGroup);
  });

  await waitFor(() => expect(result.current.responseSave).toMatchObject({}));
});

test('to save new userGroup and trigger error', async () => {
  const toggleNotificationSpy = jest.spyOn(ActionNotification, 'toogleNotification');

  (fetch as FetchMock).mockRejectedValue(error404);

  const { result } = renderHook(() => useUserGroup());

  await act(async () => {
    await result.current.save(userGroup);
  });

  await waitFor(() => expect(toggleNotificationSpy).toBeCalled());
});

test('to save new userGroup and trigger error 422', async () => {
  const toggleNotificationSpy = jest.spyOn(ActionNotification, 'toogleNotification');

  (fetch as FetchMock).mockRejectedValue(error422);

  const { result } = renderHook(() => useUserGroup());

  await act(async () => {
    await result.current.save(userGroup);
  });

  await waitFor(() => expect(toggleNotificationSpy).toBeCalled());

  expect(toggleNotificationSpy).toHaveBeenCalledWith({
    status: 'error',
    text: '[422] Group already associated to this workspace'
  });
});
