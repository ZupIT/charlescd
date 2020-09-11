/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DeploymentNotificationRequestDto } from '../../../../api/deployments/dto/deployment-notification-request.dto'

interface StageDefaultArtifact {
    customKind: boolean
    id: string
}

interface StageMatchArtifact {
    id: string
    name: string
    type: string
}

interface StageExpectedArtifact {
    defaultArtifact: StageDefaultArtifact
    displayName: string
    id: string
    matchArtifact: StageMatchArtifact
    useDefaultArtifact: boolean
    usePriorArtifact: boolean
}

interface InputArtifact {
    account: string
    id: string
}

interface Overrides {
    'image.tag': string
    deploymentName: string
    component: string
    tag: string
    circleId: string
}

interface StageEnabled {
    expression?: string
    type?: string
}

interface Moniker {
    app: string
}

interface Options {
    enableTraffic: boolean
    services: unknown[]
}

interface TrafficManagement {
    enabled: boolean
    options: Options
}

interface Metadata {
    name: string
    namespace: string
}

interface Labels {
    component: string
    tag: string
    circleId: string
}

interface Subset {
    labels: Labels
    name: string
}

interface Cookie {
    regex: string
}

interface XCircleId {
    exact: string
}

interface Headers {
    cookie?: Cookie
    'x-circle-id'?: XCircleId,
    'unreachable-cookie-name'?: XCircleId
}

interface Match {
    headers: Headers
}

interface Destination {
    host: string
    subset?: string
}

interface RequestSet {
    'x-circle-source': string
}

interface Request {
    set: RequestSet
}

interface ResponseSet {
    'x-circle-source': string
}

interface Response {
    set: ResponseSet
}

interface RouteHeaders {
    request: Request
    response: Response
}

interface Route {
    destination: Destination
    headers?: RouteHeaders
}

interface Http {
    match?: Match[]
    route: Route[]
}

interface Spec {
    host?: string
    subsets?: Subset[]
    hosts?: string[]
    http?: Http[]
    gateways?: string[]
}

interface Manifest {
    apiVersion: string
    kind: string
    metadata: Metadata
    spec: Spec
}

interface CustomHeaders {
    'x-circle-id': string
}

interface StageVariable {
    key: string
    value: string
}

interface Selector {
    key: string
    kind: string
    values: string[]
}

interface LabelSelectors {
    selectors: Selector[]
}

interface StageOptions {
    cascading: boolean
}

interface Stage {
    completeOtherBranchesThenFail?: boolean
    continuePipeline?: boolean
    expectedArtifacts?: StageExpectedArtifact[]
    failPipeline?: boolean
    inputArtifacts?: InputArtifact[]
    name: string
    namespace?: string
    outputName?: string
    overrides?: Overrides
    refId: string
    requisiteStageRefIds: string[]
    stageEnabled?: StageEnabled
    templateRenderer?: string
    type: string
    account?: string
    cloudProvider?: string
    manifestArtifactAccount?: string
    manifestArtifactId?: string
    moniker?: Moniker
    skipExpressionEvaluation?: boolean
    source?: string
    trafficManagement?: TrafficManagement
    manifests?: Manifest[]
    customHeaders?: CustomHeaders
    method?: string
    payload?: DeploymentNotificationRequestDto
    statusUrlResolution?: string
    url?: string
    failOnFailedExpressions?: boolean
    variables?: StageVariable[]
    app?: string
    kinds?: string[]
    labelSelectors?: LabelSelectors
    location?: string
    mode?: string
    nameStage?: string
    options?: StageOptions
}

interface MatchArtifact {
    artifactAccount: string
    id: string
    name: string
    type: string
}

interface DefaultArtifact {
    artifactAccount: string
    id: string
    name: string
    reference: string
    type: string
    version: string
}

interface ExpectedArtifact {
    defaultArtifact: DefaultArtifact
    displayName: string
    id: string
    matchArtifact: MatchArtifact
    useDefaultArtifact: boolean
    usePriorArtifact: boolean
}

interface SpinnakerPipeline {
    id?: string,
    application: string
    name: string
    expectedArtifacts: ExpectedArtifact[]
    stages: Stage[]
}

export {
  Subset,
  Http,
  Stage,
  ExpectedArtifact,
  SpinnakerPipeline
}
