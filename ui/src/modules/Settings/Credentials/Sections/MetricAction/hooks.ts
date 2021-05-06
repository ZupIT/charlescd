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

import { useState, useCallback } from 'react';
import { useFetchData, useFetchStatus } from 'core/providers/base/hooks';
import { toogleNotification } from 'core/components/Notification/state/actions';
import {
  getAllActions,
  deleteActionById,
  getPluginsByCategory,
  createAction as createActionRequest
} from 'core/providers/actions';
import { useDispatch } from 'core/state/hooks';
import { Action, PluginsPayload, ActionPayload } from './types';
import { ValidationError } from 'core/interfaces/ValidationError';

export const useActionData = () => {
  const getActionsData = useFetchData<Action[]>(getAllActions);
  const [actionResponse, setActionResponse] = useState([]);
  const status = useFetchStatus();

  const getActionData = useCallback(async () => {
    try {
      status.pending();
      const actionResponseData = await getActionsData();

      setActionResponse(actionResponseData);
      status.resolved();

      return actionResponseData;
    } catch (e) {
      status.rejected();
      console.log(e);
    }
  }, [getActionsData, status]);

  return {
    getActionData,
    actionResponse,
    status
  };
};

export const useDeleteAction = () => {
  const deleteActionRequest = useFetchData<Action>(deleteActionById);
  const dispatch = useDispatch();

  const deleteAction = useCallback(
    async (actionId: string) => {
      try {
        const deleteActionResponse = await deleteActionRequest(actionId);

        dispatch(
          toogleNotification({
            text: `Success deleting action`,
            status: 'success'
          })
        );

        return deleteActionResponse;
      } catch (e) {
        dispatch(
          toogleNotification({
            text: `Error metric action`,
            status: 'error'
          })
        );
      }
    },
    [deleteActionRequest, dispatch]
  );

  return {
    deleteAction
  };
};

export const usePlugins = () => {
  const getPluginsRequest = useFetchData<PluginsPayload[]>(
    getPluginsByCategory
  );
  const [plugins, setPlugins] = useState([]);

  const getPlugins = useCallback(
    async (category: string) => {
      try {
        const pluginsResponse = await getPluginsRequest(category);

        setPlugins(pluginsResponse);

        return pluginsResponse;
      } catch (e) {
        console.log(e);
      }
    },
    [getPluginsRequest]
  );

  return {
    getPlugins,
    plugins
  };
};

export const useCreateAction = () => {
  const createActionPayload = useFetchData<ActionPayload>(createActionRequest);
  const status = useFetchStatus();
  const [validationError, setValidationError] = useState<ValidationError>();
  const dispatch = useDispatch();

  const createAction = useCallback(
    async (actionPayload: ActionPayload) => {
      try {
        status.pending();
        const saveActionResponse = await createActionPayload(actionPayload);

        status.resolved();

        return saveActionResponse;
      } catch (e) {
        status.rejected();
        e.text().then((errorMessage: string) => {
          const parsedError = JSON.parse(errorMessage);
          setValidationError(parsedError);
          dispatch(
            toogleNotification({
              text: parsedError,
              status: 'error'
            })
          );
        });
      }
    },
    [createActionPayload, status, dispatch]
  );

  return {
    createAction,
    status,
    validationError
  };
};
