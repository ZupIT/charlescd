export const PERIODS = [
  {
    type: 'FIVE_MINUTES',
    value: 5,
    label: 'm',
  },
  {
    type: 'FIFTEEN_MINUTES',
    value: 15,
    label: 'm',
  },
  {
    type: 'THIRTY_MINUTES',
    value: 30,
    label: 'm',
  },
  {
    type: 'ONE_HOUR',
    value: 1,
    label: 'h',
  },
  {
    type: 'THREE_HOUR',
    value: 3,
    label: 'h',
  },
  {
    type: 'EIGHT_HOUR',
    value: 8,
    label: 'h',
  },
  {
    type: 'TWELVE_HOUR',
    value: 12,
    label: 'h',
  },
  {
    type: 'TWENTY_FOUR_HOUR',
    value: 24,
    label: 'h',
  },
]

export const REQUESTS_BY_CIRCLE = 'REQUESTS_BY_CIRCLE'
export const REQUESTS_ERRORS_BY_CIRCLE = 'REQUESTS_ERRORS_BY_CIRCLE'
export const REQUESTS_LATENCY_BY_CIRCLE = 'REQUESTS_LATENCY_BY_CIRCLE'

export const METRIC_TYPES = [
  REQUESTS_BY_CIRCLE,
  REQUESTS_ERRORS_BY_CIRCLE,
  REQUESTS_LATENCY_BY_CIRCLE,
]

export const ERROR_CHART = {
  colors: ['#FF1414'],
}

export const Y_LABEL_INT = {
  yaxis: {
    labels: {
      formatter: value => Number(value),
    },
  },
}

export const SLOW_TIME = 300000
export const FAST_TIME = 10000
