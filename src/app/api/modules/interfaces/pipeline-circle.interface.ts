interface IPipelineCircleDestination {

  version: string
}

interface IPipelineCircleUri {

  uriName: string
}

interface IPipelineCircleHeader {

  headerName: string

  headerValue: string
}

export interface IPipelineCircle {

  headers: IPipelineCircleHeader[]

  uri: IPipelineCircleUri[]

  destination: IPipelineCircleDestination[]
}
