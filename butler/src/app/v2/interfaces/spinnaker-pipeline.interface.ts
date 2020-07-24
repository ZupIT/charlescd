interface DefaultArtifact2 {
    customKind: boolean
    id: string
}

interface MatchArtifact2 {
    id: string
    name: string
    type: string
}

interface ExpectedArtifact2 {
    defaultArtifact: DefaultArtifact2
    displayName: string
    id: string
    matchArtifact: MatchArtifact2
    useDefaultArtifact: boolean
    usePriorArtifact: boolean
}

interface InputArtifact {
    account: string
    id: string
}

interface Overrides {
    'image.tag': string
    name: string
}

interface StageEnabled {
    expression: string
    type: string
}

interface Moniker {
    app: string
}

interface Options {
    enableTraffic: boolean
    services: any[]
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
    version: string
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
    cookie: Cookie
    'x-circle-id': XCircleId
}

interface Match {
    headers: Headers
}

interface Destination {
    host: string
    subset: string
}

interface Set {
    'x-circle-source': string
}

interface Request {
    set: Set
}

interface Set2 {
    'x-circle-source': string
}

interface Response {
    set: Set2
}

interface Headers2 {
    request: Request
    response: Response
}

interface Route {
    destination: Destination
    headers: Headers2
}

interface Http {
    match: Match[]
    route: Route[]
}

interface Spec {
    host: string
    subsets: Subset[]
    hosts: string[]
    http: Http[]
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

interface Payload {
    status: string
}

interface Variable {
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

interface Options2 {
    cascading: boolean
}

interface Stage {
    completeOtherBranchesThenFail: boolean
    continuePipeline: boolean
    expectedArtifacts: ExpectedArtifact2[]
    failPipeline: boolean
    inputArtifacts: InputArtifact[]
    name: string
    namespace: string
    outputName: string
    overrides: Overrides
    refId: string
    requisiteStageRefIds: string[]
    stageEnabled: StageEnabled
    templateRenderer: string
    type: string
    account: string
    cloudProvider: string
    manifestArtifactAccount: string
    manifestArtifactId: string
    moniker: Moniker
    skipExpressionEvaluation?: boolean
    source: string
    trafficManagement: TrafficManagement
    manifests: Manifest[]
    customHeaders: CustomHeaders
    method: string
    payload: Payload
    statusUrlResolution: string
    url: string
    failOnFailedExpressions?: boolean
    variables: Variable[]
    app: string
    kinds: string[]
    labelSelectors: LabelSelectors
    location: string
    mode: string
    nameStage: string
    options: Options2
}

/** expected artifact stuff **/

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

/** main obj **/

interface SpinnakerPipeline {
    application: string
    name: string
    expectedArtifacts: ExpectedArtifact[]
    stages: Stage[]
}

