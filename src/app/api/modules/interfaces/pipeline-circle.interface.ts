interface IPipelineCircleDestination {

  version: string
}

interface IPipelineCircleHeader {

  headerName: string

  headerValue: string
}

export interface IPipelineCircle {

  headers: IPipelineCircleHeader[]

  destination: IPipelineCircleDestination[]
}
