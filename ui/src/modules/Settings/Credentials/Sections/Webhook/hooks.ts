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
import { saveConfig, delConfig } from 'core/providers/webhook';
import { FetchStatuses, useFetchData } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { Webhook } from './interfaces';

interface SaveProps {
  status: FetchStatuses;
  save: Function;
}

interface DelProps {
  status: FetchStatuses;
  remove: Function;
}

export const useWebhook = (): SaveProps => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const create = useFetchData(saveConfig);

  const save = useCallback(
    async (webhook: Webhook) => {
      try {
        setStatus('pending');
        await create(webhook);
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
    [create, dispatch]
  );

  return {
    status,
    save
  };
};

export const useDelWebhook = (): DelProps => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<FetchStatuses>('idle');
  const removeConfig = useFetchData(delConfig);

  const remove = useCallback(
    async (webhook: Webhook) => {
      try {
        setStatus('pending');
        await removeConfig(webhook);
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
    [removeConfig, dispatch]
  );

  return {
    status,
    remove
  };
};
