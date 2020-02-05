import buildInputArtifact from './helpers/build-input-artifacts'
import { createPrimaryId, createBakeStage } from './helpers/create-id-names'
import helmTypes from './helpers/constants'
import createProduceArtifact from './helpers/build-expected-artifact-produce'

const baseStageHelm = ({ appNamespace, appName }, githubAccount, version, versionUrl, refId, reqRefId, previousStage) => {
  const baseHelm = {
    stageEnabled: {},
    completeOtherBranchesThenFail: false,
    continuePipeline: true,
    failPipeline: false,
    expectedArtifacts: [createProduceArtifact(version, appName)],
    inputArtifacts: helmTypes.map(helmType => buildInputArtifact(githubAccount, createPrimaryId(helmType, appName))),
    name: createBakeStage(version),
    namespace: appNamespace,
    outputName: `${appName}-${version}`,
    overrides: {
      'image.tag': versionUrl,
      'name': version
    },
    templateRenderer: 'HELM2',
    type: 'bakeManifest',

    refId,
    requisiteStageRefIds: reqRefId
  }
  if (previousStage) {
    baseHelm.stageEnabled = {
      // eslint-disable-next-line quotes
      expression: '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
      type: 'expression'
    }
  }
  return baseHelm
}
export default baseStageHelm
