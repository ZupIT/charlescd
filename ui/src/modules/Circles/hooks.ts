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

import { useEffect, useCallback, useState } from 'react';
import { useFetch, useFetchData } from 'core/providers/base/hooks';
import {
  findAllCircles,
  findCircleById,
  findComponents,
  updateCircleWithFile,
  createCircleWithFile,
  createCircleManually,
  updateCircleManually,
  findAllCirclesWithoutActive,
  findCircleByIdQuery,
  findComponentsQuery,
  deleteCircleByIdQuery
} from 'core/providers/circle';
import { undeploy } from 'core/providers/deployment';
import { useDispatch } from 'core/state/hooks';
import {
  loadedCirclesAction,
  loadedCirclesMetricsAction
} from './state/actions';
import { CirclePagination } from './interfaces/CirclesPagination';
import {
  Circle,
  Component,
  CreateCircleWithFilePayload,
  CreateCircleManuallyPayload,
  Deployment
} from './interfaces/Circle';
import { toogleNotification } from 'core/components/Notification/state/actions';
import { buildFormData } from './helpers';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { Pagination } from 'core/interfaces/Pagination';
import { useMutation, useQuery } from 'react-query';

export enum CIRCLE_TYPES {
  metrics = 'metrics',
  list = 'list'
}

export enum CIRCLE_STATUS {
  active = 'actives',
  inactives = 'inactives',
  hypotheses = 'hypotheses'
}

export const useCircleQuery = (id: string) => {
  return useQuery(['getCircleById', id], findCircleByIdQuery, {
    enabled: id !== NEW_TAB
  });
};

export const useCircleComponentsQuery = (id: string, hasDeploy: boolean) => {
  return useQuery(['getCircleComponents', id], findComponentsQuery, {
    enabled: hasDeploy
  });
};

export const useCircle = () => {
  const [circle, getCircle] = useFetch<Circle>(findCircleById);
  const [componentsResponse, getComponents] = useFetch<Component[]>(
    findComponents
  );
  const { response: circleResponse, loading } = circle;
  const { response: components } = componentsResponse;

  const loadCircle = useCallback(
    (id: string) => {
      getCircle({ id });
    },
    [getCircle]
  );

  const loadComponents = useCallback(
    (id: string) => {
      getComponents(id);
    },
    [getComponents]
  );

  return [
    { circleResponse, loading, components },
    { loadCircle, loadComponents }
  ];
};

export const useCirclePolling = (): {
  pollingCircle: Function;
  resetStatus: () => void;
  status: string;
  response: Circle;
} => {
  const [, , getCircle] = useFetch<Circle>(findCircleById);
  const [status, setStatus] = useState('idle');
  const [response, setResponse] = useState<Circle>(null);

  const resetStatus = () => setStatus('idle');

  const pollingCircle = useCallback(
    async (id: string) => {
      try {
        setStatus('pending');
        const data = await getCircle({ id });
        setResponse(data);
        setStatus('resolved');
      } catch (e) {
        setStatus('rejected');
      }
    },
    [getCircle]
  );

  return {
    pollingCircle,
    response,
    status,
    resetStatus
  };
};

export const useDeleteCircleQuery = () => {
  const dispatch = useDispatch();
  const [mutate, { status }] = useMutation(deleteCircleByIdQuery, {
    onError: (error, { name }) => {
      dispatch(
        toogleNotification({
          text: `The circle ${name} could not be deleted.`,
          status: 'error'
        })
      );
    },
    onSuccess: (error, { name }) => {
      dispatch(
        toogleNotification({
          text: `The circle ${name} has been deleted.`,
          status: 'success'
        })
      );
    }
  });

  const deleteCircle = useCallback(
    (id: string, deployStatus: string, name: string) => {
      if (deployStatus === undefined) {
        mutate({ id, name });
      } else {
        dispatch(
          toogleNotification({
            text: `The circle ${name} could not be deleted.`,
            status: 'error'
          })
        );
      }
    },
    [dispatch, mutate]
  );

  return { deleteCircle, deleteCircleStatus: status };
};

export const useCirclesData = () => {
  const getCirclesData = useFetchData<Pagination<Circle>>(
    findAllCirclesWithoutActive
  );

  return {
    getCirclesData
  };
};

export const useCircles = (
  type: CIRCLE_TYPES
): [boolean, Function, Function, CirclePagination] => {
  const dispatch = useDispatch();
  const [circlesData, getCircles] = useFetch<CirclePagination>(findAllCircles);
  const { response, error, loading } = circlesData;

  const filterCircles = useCallback(
    (name: string, status: string) => {
      if (status === CIRCLE_STATUS.active) {
        getCircles({ name, active: true });
      } else if (status === CIRCLE_STATUS.inactives) {
        getCircles({ name, active: false });
      }
    },
    [getCircles]
  );

  useEffect(() => {
    if (!error && type === CIRCLE_TYPES.list) {
      dispatch(loadedCirclesAction(response));
    } else if (!error && type === CIRCLE_TYPES.metrics) {
      dispatch(loadedCirclesMetricsAction(response));
    } else {
      console.error(error);
    }
  }, [dispatch, response, error, type]);

  return [loading, filterCircles, getCircles, response];
};

export const useSaveCircleManually = (
  circleId: string
): [Circle, Function, boolean] => {
  const saveCircleRequest =
    circleId !== NEW_TAB ? updateCircleManually : createCircleManually;
  const [circleData, saveCircle] = useFetch<Circle>(saveCircleRequest);
  const { response, error, loading: isSaving } = circleData;
  const dispatch = useDispatch();

  const saveCircleManually = useCallback(
    (circle: CreateCircleManuallyPayload) => {
      saveCircle(circle, circleId);
    },
    [saveCircle, circleId]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `Error to save circle`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  return [response, saveCircleManually, isSaving];
};

export const useSaveCircleWithFile = (
  circleId: string
): [Circle, Function, boolean] => {
  const saveCircleRequest =
    circleId !== NEW_TAB ? updateCircleWithFile : createCircleWithFile;
  const [circleData, saveCircle] = useFetch<Circle>(saveCircleRequest);
  const { response, error, loading: isSaving } = circleData;
  const dispatch = useDispatch();

  const saveCircleWithFile = useCallback(
    (circle: CreateCircleWithFilePayload) => {
      const payload = buildFormData(circle);
      saveCircle(payload, circleId);
    },
    [saveCircle, circleId]
  );

  useEffect(() => {
    if (error) {
      dispatch(
        toogleNotification({
          text: `Error performing upload`,
          status: 'error'
        })
      );
    }
  }, [error, dispatch]);

  return [response, saveCircleWithFile, isSaving];
};

export const useCircleUndeploy = (): {
  undeployRelease: Function;
  status: string;
  resetStatus: () => void;
} => {
  const [status, setStatus] = useState('idle');
  const [, , makeUndeploy] = useFetch(undeploy);

  const resetStatus = () => setStatus('idle');

  const undeployRelease = useCallback(
    async (deployment: Deployment) => {
      try {
        if (deployment) {
          setStatus('pending');
          await makeUndeploy(deployment.id);
          setStatus('resolved');
        }
      } catch (e) {
        setStatus('rejected');
      }
    },
    [makeUndeploy]
  );

  return {
    undeployRelease,
    status,
    resetStatus
  };
};

export default useCircles;
