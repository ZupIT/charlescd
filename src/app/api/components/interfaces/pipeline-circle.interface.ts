interface IPipelineCircleDestination {

  version: string
}

interface IPipelineCircleHeader {

  headerName: string

  headerValue: string
}

export interface IPipelineCircle {

  header?: IPipelineCircleHeader

  destination: IPipelineCircleDestination
}
