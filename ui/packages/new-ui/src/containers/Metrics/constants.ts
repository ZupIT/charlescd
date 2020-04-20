import { PROJECTION_TYPE } from './enums';

export const PERIODS = [
  {
    type: PROJECTION_TYPE.FIVE_MINUTES,
    value: 5,
    label: 'm'
  },
  {
    type: PROJECTION_TYPE.THIRTY_MINUTES,
    value: 30,
    label: 'm'
  },
  {
    type: PROJECTION_TYPE.ONE_HOUR,
    value: 1,
    label: 'h'
  },
  {
    type: PROJECTION_TYPE.THREE_HOUR,
    value: 3,
    label: 'h'
  },
  {
    type: PROJECTION_TYPE.EIGHT_HOUR,
    value: 8,
    label: 'h'
  }
];
