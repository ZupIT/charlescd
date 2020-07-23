
import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto';
import Joi = require('@hapi/joi');
@Injectable()
export class DeployValidationPipe implements PipeTransform {


  transform(createDeploymentDto: CreateDeploymentRequestDto) : CreateDeploymentRequestDto {
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


    const { error } = schema.validate(createDeploymentDto, {abortEarly: false});
    if (error) {
      throw new UnprocessableEntityException(error.details.map(e => e.message));
    }
    return createDeploymentDto
  }
}
