// playground file

import { flatten } from 'lodash';
import { createConnection } from 'typeorm';
import { CdConfigurationEntity } from './app/v1/api/configurations/entity';
import { DeploymentEntity } from './app/v2/api/deployments/entity/deployment.entity';
import Joi = require('@hapi/joi');



const component = Joi.object(
  {
    componentId: Joi.string(),
    componentName: Joi.string(),
    buildImageUrl: Joi.string(),
    buildImageTag: Joi.string()
  }
)
const componentModule = Joi.object(
  {
    moduleId: Joi.string().required(),
    helmRepository: Joi.string().required(),
    components: Joi.array().items(component).required()
  }
)

const circle = Joi.object({
  headerValue: Joi.string().required()
})

const schema = Joi.object({
  deploymentId: Joi.string().required(),
  authorId: Joi.string().required(),
  callbackUrl: Joi.string().required(),
  cdConfigurationId: Joi.string().required(),
  circle: circle,
  modules: Joi.array().items(componentModule).required()
})


interface DeploymentModules {
  moduleId: string
  helmRepository: string
  components: DeploymentComponent[]
}

interface DeploymentComponent {
  componentId: string
  componentName: string
  buildImageUrl: string
  buildImageTag: string
}

interface DeploymentParams {
  deploymentId: string
  authorId: string
  callbackUrl: string
  cdConfigurationId: string
  modules: DeploymentModules[]
  circle: {
    headerValue: string
  }
}

const params : DeploymentParams = {
  deploymentId: '5ba3691b-d647-4a36-9f6d-c089f114e476',
  modules: [
    {
      moduleId: 'e2c937cb-d77e-48db-b1ea-7d3df16fd02c',
      helmRepository: 'helm-repository.com',
      components: [
        {
          componentId: 'c41f029d-186c-4097-ad43-1b344b2e8041',
          componentName: 'component-name',
          buildImageUrl: 'image-url',
          buildImageTag: 'image-tag'
        },
        {
          componentId: 'f4c4bcbe-58a9-41cc-ad8b-7177121905de',
          componentName: 'component-name2',
          buildImageUrl: 'image-url2',
          buildImageTag: 'image-tag2'
        }
      ]
    }
  ],
  authorId: 'author-id',
  callbackUrl: 'http://localhost:8883/moove',
  cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
  circle: {
    headerValue: 'circle-header'
  }
}


const validatedSchema = schema.validate(params)
// console.log(JSON.stringify(schema.validate(params)))
console.log(validatedSchema)

// async function main() {
//   const validatedParams = await schema.validate(params)
//   const rootPath = __dirname
//   const connection = await createConnection({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'darwin',
//     password: 'darwin',
//     database: 'darwin',
//     entities: [`${rootPath}/app/v2/entities/*.{ts,js}`, `${rootPath}/app/v1/api/configurations/entity/cd-configuration.entity.ts`]
//   });

//   const manager = connection.manager
//   const cdConfig = await manager.findOneOrFail(CdConfigurationEntity, params.cdConfigurationId)
// const existingDeployment = await manager.findOne(DeploymentEntity, params.deploymentId)
//   if (existingDeployment) {
//     console.log(existingDeployment)
//     throw new Error('ja tem deploy com esse id')
//   }
//   const deploymentParams = deploymentCreateDTOFromParams(params, cdConfig)
//   const deployment = manager.create(DeploymentEntity, deploymentParams)
//   deployment.cdConfiguration = cdConfig
//   console.log(deployment)
//   console.log(await manager.save(deployment))
// }

// const deploymentCreateDTOFromParams = (deploymentParams: DeploymentParams, cdConfiguration: CdConfigurationEntity) => {
//   return {
//     id: deploymentParams.deploymentId,
//     authorId: deploymentParams.authorId,
//     callbackUrl: deploymentParams.callbackUrl,
//     cdConfiguration: cdConfiguration,
//     circleId: deploymentParams.circle.headerValue,
//     components: flatten(
//       deploymentParams.modules.map((m) => m.components.map((c) => {
//         return componentCreateDTOFromParams(c, m.helmRepository)
//       })))
//   }
// }

// const componentCreateDTOFromParams = (componentParams: DeploymentComponent, helmUrl: string) => {
//   return {
//     componentId: componentParams.componentId,
//     name: componentParams.componentName,
//     imageUrl: componentParams.buildImageUrl,
//     imageTag: componentParams.buildImageTag,
//     helmUrl: helmUrl
//   }
// }

// main()
