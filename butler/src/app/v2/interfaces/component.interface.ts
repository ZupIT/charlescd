import { Deployment } from './deployment.interface'

export interface Component {
    id: string

    helmUrl: string

    imageTag: string

    imageUrl: string

    name: string

    running: boolean

    deployment?: Deployment
}