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

import { useCallback, useState } from 'react';
import { useDispatch } from 'core/state/hooks';
import {
  saveConfig,
  delConfig,
  getConfig,
  editConfig
} from 'core/providers/webhook';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Webhook } from './interfaces';

interface Props {
  status: FetchStatuses;
  save: (webhook: Webhook) => Promise<never>;
  remove: (id: string) => Promise<never>;
  list: Function;
  edit: (webhook: Partial<Webhook>) => Promise<never>;
}

export const useWebhook = (): Props => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const saving = useFetchData(saveConfig);
  const removing = useFetchData(delConfig);
  const listing = useFetchData(getConfig);
  const editing = useFetchData(editConfig);

  const save = useCallback(
    async (webhook: Webhook) => {
      try {
        setStatus('pending');
        await saving(webhook);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
        const error = await e.json();
        dispatch(
          toogleNotification({
            text: `[${e.status}] ${error.message}`,
            status: 'error'
          })
        );
        return Promise.reject(error);
      }
    },
    [saving, dispatch]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        setStatus('pending');
        await removing(id);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
        const error = await e.json();
        dispatch(
          toogleNotification({
            text: `[${e.status}] ${error.message}`,
            status: 'error'
          })
        );
        return Promise.reject(error);
      }
    },
    [removing, dispatch]
  );

  const list = useCallback(
    async (webhook: Webhook) => {
      try {
        setStatus('pending');
        await listing(webhook);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
        const error = await e.json();
        dispatch(
          toogleNotification({
            text: `[${e.status}] ${error.message}`,
            status: 'error'
          })
        );
        return Promise.reject(error);
      }
    },
    [listing, dispatch]
  );

  const edit = useCallback(
    async (webhook: Webhook) => {
      try {
        setStatus('pending');
        await editing(webhook);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
        const error = await e.json();
        dispatch(
          toogleNotification({
            text: `[${e.status}] ${error.message}`,
            status: 'error'
          })
        );
        return Promise.reject(error);
      }
    },
    [editing, dispatch]
  );

  return {
    status,
    save,
    remove,
    list,
    edit
  };
};
