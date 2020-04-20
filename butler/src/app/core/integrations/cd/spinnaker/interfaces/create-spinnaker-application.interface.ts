interface ICreateSpinnakerApplicationJobConfig {

  cloudProviders: string

  instancePort: number

  name: string

  email: string
}

interface ICreateSpinnakerApplicationJob {

  type: string

  application: ICreateSpinnakerApplicationJobConfig
}

export interface ICreateSpinnakerApplication {

  job: ICreateSpinnakerApplicationJob[],

  application: string
}
