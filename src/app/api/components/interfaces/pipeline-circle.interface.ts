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

// export type IPipelineCircle = IPipelineSpecificCircle | IDefaultPipelineCircle

// export interface IPipelineSpecificCircle {
//   header: IPipelineCircleHeader
//   destination: IPipelineCircleDestination
// }

// export interface IDefaultPipelineCircle {
//   destination: IPipelineCircleDestination
// }
