import { CirclePagination } from './CirclesPagination';
import { Circle } from './Circle';

export interface CircleState {
  list: CirclePagination;
  metrics: CirclePagination;
  item: Circle;
}
