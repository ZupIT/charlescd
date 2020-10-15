/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'


@ValidatorConstraint({ name: 'imageTagValidation', async: false })
export class ImageTagValidation implements ValidatorConstraintInterface {

  public validate(components: CreateComponentRequestDto[]): boolean {
    const invalidTags = this.getInvalidTags(components)

    return invalidTags.length === 0
  }

  public defaultMessage(args: ValidationArguments): string {
    const invalidTags = this.getInvalidTags(args.value).map(c => JSON.stringify(c))

    return `The tag suplied on the buildImageUrl must match the buildImageTag. Check the values of the component(s) ${invalidTags}`
  }

  private getInvalidTags(components: CreateComponentRequestDto[]) : CreateComponentRequestDto[] {
    return components.filter(c => {
      return c.buildImageTag !== this.extractTagFromUrl(c)
    })
  }

  private extractTagFromUrl(component: CreateComponentRequestDto): string {
    const extractedTag = component.buildImageUrl.split(':')
    if (extractedTag.length === 1) {
      return component.buildImageTag
    }
    return extractedTag[extractedTag.length -1]
  }
}
