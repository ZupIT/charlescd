import { IStageEnabled } from '../interfaces'
import createProduceArtifact, { ICreateProduceArtifact } from './helpers/build-expected-artifact-produce'
import helmTypes, { HelmTypes } from './helpers/constants'
import { createBakeStage, createPrimaryId } from './helpers/create-id-names'

interface IInputArtifact {
  account: string
  id: string
}

const buildInputArtifact = (githubAccount: string, idArtifact: string): IInputArtifact => {
  return {
    account: githubAccount,
    id: idArtifact
  }
}

interface IAppConfig {
  appNamespace: string
  appName: string
}

export interface IBaseHelmStage {
  stageEnabled: IStageEnabled | {}
  completeOtherBranchesThenFail: false
  continuePipeline: true
  failPipeline: false
  expectedArtifacts: ICreateProduceArtifact[]
  inputArtifacts: IInputArtifact[]
  name: string
  namespace: string
  outputName: string
  overrides: {
    'image.tag': string
    name: string
  }
  templateRenderer: 'HELM2'
  type: 'bakeManifest'
  refId: string
  requisiteStageRefIds: string[]
}

const baseStageHelm = ({ appNamespace, appName }: IAppConfig,
                       githubAccount: string,
                       version: string, versionUrl: string, refId: string,
                       reqRefId: string[], previousStage: string | undefined | string[]): IBaseHelmStage => {
  const baseHelm: IBaseHelmStage = {
    stageEnabled: {},
    completeOtherBranchesThenFail: false,
    continuePipeline: true,
    failPipeline: false,
    expectedArtifacts: [createProduceArtifact(version, appName)],
    inputArtifacts: helmTypes.map(helmType => buildInputArtifact(githubAccount, createPrimaryId(helmType as HelmTypes, appName))),
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
      expression: '${ #stage(\'' + previousStage + '\').status.toString() == \'SUCCEEDED\'}',
      type: 'expression'
    }
  }
  return baseHelm
}
export default baseStageHelm
