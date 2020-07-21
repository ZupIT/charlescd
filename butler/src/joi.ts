// //Insert your joi schema here
// import Joi = require('joi');

import { createConnection } from 'typeorm';
import { ComponentEntity } from './app/v2/entities/component.entity';
import { DeploymentEntity } from './app/v2/entities/deployment.entity';
import { flatten } from 'lodash';



// const component = Joi.object(
//   {
//     componentId: Joi.string(),
//     componentName: Joi.string(),
//     buildImageUrl: Joi.string(),
//     buildImageTag: Joi.string()
//   }
// )
// const componentModule = Joi.object(
//   {
//     moduleId: Joi.string().required(),
//     helmRepository: Joi.string().required(),
//     components: Joi.array().items(component).required()
//   }
// )

// const circle = Joi.object({
//   headerValue: Joi.string().required()
// })

// const schema = Joi.object({
//   deploymentId: Joi.string().required(),
//   applicationName: Joi.string().required(),
//   authorId: Joi.string().required(),
//   description: Joi.string().required(),
//   callbackUrl: Joi.string().required(),
//   cdConfigurationId: Joi.string().required(),
//   circle: circle,
//   modules: Joi.array().items(componentModule).required()
// })


const params = {
  deploymentId: '5ba3691b-d647-4a36-9f6d-c089f114e476',
  applicationName: 'c26fbf77-5da1-4420-8dfa-4dea235a9b1e',
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
  description: 'Deployment from Charles C.D.',
  callbackUrl: 'http://localhost:8883/moove',
  cdConfigurationId: '4046f193-9479-48b5-ac29-01f419b64cb5',
  circle: {
    headerValue: 'circle-header'
  }
}

// // console.log(JSON.stringify(schema.validate(params)))
// console.log(schema.validate(params))

async function main() {
  const rootPath = __dirname
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'darwin',
    password: 'darwin',
    database: 'darwin',
    entities: [`${rootPath}/app/v2/entities/*.{ts,js}`]
  });
  console.log(`${rootPath}/app/v2/entities`)

  const manager = connection.manager
  // const deployment = new DeploymentEntity()
  // console.log(flatten(params.modules.map( m => m.components)))
  const components = manager.create(ComponentEntity, [{componentId: 'aaa'}])
  // const components = manager.create(ComponentEntity, flatten(params.modules.map( m => m.components)))
  console.log(components)
  // const deployment = manager.save(DeploymentEntity, params)
  // console.log(deployment)

}

main()
