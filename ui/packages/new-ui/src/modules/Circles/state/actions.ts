import { CirclePagination } from '../interfaces/CirclesPagination';
import { Circle } from '../interfaces/Circle';

export enum ACTION_TYPES {
  loadedCircles = 'CIRCLES/LOADED_CIRCLES',
  loadedCircle = 'CIRLCES/LOADED_CIRCLE',
  loadedCirclesMetrics = 'CIRCLE/LOADED_CIRCLES_METRICS'
}

interface LoadedCirclesActionType {
  type: typeof ACTION_TYPES.loadedCircles;
  payload: CirclePagination;
}

interface LoadedCircleActionType {
  type: typeof ACTION_TYPES.loadedCircle;
  payload: Circle;
}

interface LoadedCirclesMetricsActionType {
  type: typeof ACTION_TYPES.loadedCirclesMetrics;
  payload: CirclePagination;
}

export const loadedCirclesAction = (
  payload: CirclePagination
): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCircles,
  payload
});

export const loadedCircleAction = (payload: Circle): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCircle,
  payload
});

export const loadedCirclesMetricsAction = (
  payload: CirclePagination
): CirclesActionTypes => ({
  type: ACTION_TYPES.loadedCirclesMetrics,
  payload
});

export type CirclesActionTypes =
  | LoadedCirclesActionType
  | LoadedCircleActionType
  | LoadedCirclesMetricsActionType;
