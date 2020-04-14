import map from 'lodash/map'
import first from 'lodash/first'
import { PERIODS } from './constants'

export const toList = data => map(data, ({ value, timestamp }) => [timestamp, value])

export const initialPeriodSelected = first(PERIODS)
