import { completeSpinnakerPipeline } from './deployment-complete-pipeline'
import { noUnusedSpinnakerPipeline } from './no-unused'
import { oneComponentSpinnakerPipeline } from './one-component'
import { oneComponentVSSpinnakerPipeline } from './one-component-virtualservice'
import { oneComponentNoUnused } from './one-component-no-unused'
import { oneComponentWithUnused } from './one-component-with-unused'
import { oneComponentNoRepeatedSubset } from './one-component-no-repeated-subset'
import { oneComponentNoRollbackStage } from './one-component-no-rollback'

export {
  completeSpinnakerPipeline,
  noUnusedSpinnakerPipeline,
  oneComponentSpinnakerPipeline,
  oneComponentVSSpinnakerPipeline,
  oneComponentNoUnused,
  oneComponentWithUnused,
  oneComponentNoRepeatedSubset,
  oneComponentNoRollbackStage
}