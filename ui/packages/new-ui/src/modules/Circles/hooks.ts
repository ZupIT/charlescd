import { useEffect, useCallback } from 'react';
import { useFetch } from 'core/providers/base/hooks';
import { findAllCircles, findCircleById } from 'core/providers/circle';
import { useDispatch } from 'core/state/hooks';
import {
  loadedCirclesAction,
  loadedCirclesMetricsAction
} from './state/actions';
import { CirclePagination } from './interfaces/CirclesPagination';
import { Circle } from './interfaces/Circle';

export enum CIRCLE_TYPES {
  metrics = 'metrics',
  list = 'list'
}

export enum CIRCLE_STATUS {
  active = 'actives',
  inactives = 'inactives',
  hypotheses = 'hypotheses'
}

export const useCircle = (): [Circle, Function, Function] => {
  const [circleData, getCircle] = useFetch<Circle>(findCircleById);
  const { response } = circleData;

  const loadCircle = useCallback(
    (id: string) => {
      getCircle({ id });
    },
    [getCircle]
  );

  return [response, loadCircle, getCircle];
};

export const useCircles = (
  type: CIRCLE_TYPES
): [boolean, Function, Function] => {
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

  return [loading, filterCircles, getCircles];
};

export default useCircles;
