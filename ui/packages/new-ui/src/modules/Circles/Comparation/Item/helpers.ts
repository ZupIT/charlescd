import indexOf from 'lodash/indexOf';
import { METRICS_TYPE } from 'containers/Metrics/enums';
import routes from 'core/constants/routes';
import { generatePathV1 } from 'core/helpers/path';
import { URL_PATH_POSITION, DEFAULT_CIRCLE } from './constants';

export type ChangeType = 'INCREASE' | 'DECREASE';

export const pathCircleEditById = (id: string) =>
  generatePathV1(routes.circlesEdit, { circleId: id });

export const pathCircleById = (id: string) => {
  const path = window.location.href.split('?')[URL_PATH_POSITION];
  return `${path}?circle=${id}`;
};

export const isDefaultCircle = (name: string) => name === DEFAULT_CIRCLE;

export const validateChangeMetricTypes = (index: number) => {
  const BASE_INDEX = 0;
  const LAST_INDEX_ELEMENT = 1;
  const LAST_INDEX = Object.keys(METRICS_TYPE).length - LAST_INDEX_ELEMENT;

  if (index > LAST_INDEX) {
    return BASE_INDEX;
  }
  if (index < BASE_INDEX) {
    return LAST_INDEX;
  }

  return index;
};

export const getActiveMetric = (
  changeType: ChangeType,
  activeMetricType: METRICS_TYPE
) => {
  const COUNT = 1;
  const currentItemIndex = indexOf(Object.keys(METRICS_TYPE), activeMetricType);
  const computedIndex =
    changeType === 'INCREASE'
      ? currentItemIndex + COUNT
      : currentItemIndex - COUNT;
  const currentIndex = validateChangeMetricTypes(computedIndex);

  return Object.keys(METRICS_TYPE)[currentIndex] as METRICS_TYPE;
};

export const getActiveMetricDescription = (activeMetricType: METRICS_TYPE) => {
  return {
    [METRICS_TYPE.REQUESTS_BY_CIRCLE]: 'Request',
    [METRICS_TYPE.REQUESTS_ERRORS_BY_CIRCLE]: 'Errors',
    [METRICS_TYPE.REQUESTS_LATENCY_BY_CIRCLE]: 'Latency'
  }[activeMetricType];
};
