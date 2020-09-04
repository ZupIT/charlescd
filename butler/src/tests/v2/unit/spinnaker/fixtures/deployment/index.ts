import { completeSpinnakerPipeline } from './deployment-complete-pipeline'
import { noUnusedSpinnakerPipeline } from './no-unused'
import { oneComponentSpinnakerPipeline } from './one-component'
import { oneComponentVSSpinnakerPipeline } from './one-component-virtualservice'
import { oneComponentSameTagDiffCirclesUnused } from './one-component-same-tag-diff-circles-unused'
import { oneComponentWithUnused } from './one-component-with-unused'
import { oneComponentDiffSubsetsSameTag } from './one-component-diff-subsets-same-tag'
import { oneComponentNoRollbackStage } from './one-component-no-rollback'
import { oneComponentHostnameGateway } from './one-component-hostname-gateway'

export {
  completeSpinnakerPipeline,
  noUnusedSpinnakerPipeline,
  oneComponentSpinnakerPipeline,
  oneComponentVSSpinnakerPipeline,
  oneComponentSameTagDiffCirclesUnused,
  oneComponentWithUnused,
  oneComponentDiffSubsetsSameTag,
  oneComponentNoRollbackStage,
  oneComponentHostnameGateway
}