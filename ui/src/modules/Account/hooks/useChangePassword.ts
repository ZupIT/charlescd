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
import { useCallback } from 'react';
import {
  useFetchData,
  useFetchStatus,
  FetchStatus
} from 'core/providers/base/hooks';
import { useDispatch } from 'core/state/hooks';
import { CheckPassword } from 'modules/Account/interfaces/ChangePassword';
import { changePassword } from 'core/providers/users';
import { toogleNotification } from 'core/components/Notification/state/actions';

export const useChangePassword = (): {
  updatePassword: Function;
  status: FetchStatus;
} => {
  const changePass = useFetchData<CheckPassword>(changePassword);
  const dispatch = useDispatch();
  const status = useFetchStatus();

  const updatePassword = useCallback(
    async (payload: CheckPassword) => {
      try {
        status.pending();
        await changePass(payload);
        dispatch(
          toogleNotification({
            text: 'Password changed successfully.',
            status: 'success'
          })
        );
        status.resolved();
      } catch (e) {
        dispatch(
          toogleNotification({
            text: 'it was not possible to change the password.',
            status: 'error'
          })
        );
        status.rejected();
      }
    },
    [changePass, status, dispatch]
  );

  return {
    updatePassword,
    status
  };
};
