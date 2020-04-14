import filter from 'lodash/filter';
import find from 'lodash/find';
import { CIRCLE } from '../enums';
import { CirclePaginationItem } from '../interfaces/CirclesPagination';

export const prepareCircles = (circles: CirclePaginationItem[]) => [
  ...filter(circles, item => item.id !== CIRCLE.ID_CIRCLE_DEFAULT)
];

export const getDefaultCircle = (circles: CirclePaginationItem[]) =>
  find(circles, item => item.id === CIRCLE.ID_CIRCLE_DEFAULT);
