// playground file

import Joi = require('joi');

import { flatten } from 'lodash';
import { createConnection } from 'typeorm';
import { DeploymentEntity } from './app/v2/entities/deployment.entity';



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
  applicationName: Joi.string().required(),
  authorId: Joi.string().required(),
  description: Joi.string().required(),
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
  cdConfigurationId: 'id-123-123-132',
  circle: {
    headerValue: 'circle-header'
  }
}


// // console.log(JSON.stringify(schema.validate(params)))
// console.log(schema.validate(params))

async function main() {
  const validatedParams = await schema.validate(params)
  const rootPath = __dirname
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'darwin',
    password: 'darwin',
    database: 'darwin',
    entities: [`${rootPath}/app/v2/entities/*.{ts,js}`, `${rootPath}/app/api/configurations/entity/cd-configuration.entity.ts`]
  });
  console.log(`${rootPath}/app/v2/entities`)

  const manager = connection.manager

  console.log(deploymentCreateDTOFromParams(params))
  const deploymentParams = deploymentCreateDTOFromParams(params)
  const deployment = manager.create(DeploymentEntity, deploymentParams)
  manager.save(deployment)
}

const deploymentCreateDTOFromParams = (deploymentParams: DeploymentParams) => {
  return {
    id: deploymentParams.deploymentId,
    authorId: deploymentParams.authorId,
    callbackUrl: deploymentParams.callbackUrl,
    cdConfigurationId: deploymentParams.cdConfigurationId,
    circleId: deploymentParams.circle.headerValue,
    components: flatten(
      deploymentParams.modules.map((m) => m.components.map((c) => {
        return componentCreateDTOFromParams(c, m.helmRepository)
      })))
  }
}

const componentCreateDTOFromParams = (componentParams: DeploymentComponent, helmUrl: string) => {
  return {
    id: componentParams.componentId,
    name: componentParams.componentName,
    imageUrl: componentParams.buildImageUrl,
    imageTag: componentParams.buildImageTag,
    helmUrl: helmUrl
  }
}

main()
