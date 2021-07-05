export enum Scope {
  APPLICATION = 'APPLICATION',
  CLUSTER = 'CLUSTER',
}

type Meta = { [key: string]: string }

export interface Metadata {
  scope?: Scope,
  content?: Meta[],
}
