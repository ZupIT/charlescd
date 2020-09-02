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

import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'


@ValidatorConstraint({ name: 'compositeFieldSize', async: false })
export class CompositeFieldSize implements ValidatorConstraintInterface {
  private invalidSizes!: CreateComponentRequestDto[]

  public validate(components: CreateComponentRequestDto[]): boolean {
    this.invalidSizes = components.filter(c => {
      return (c.componentName.length + c.buildImageTag.length) > 63
    })
    return this.invalidSizes.length === 0
  }

  public defaultMessage() : string {
    return 'Sum of lengths of componentName and buildImageTag cant be greater than 63'
  }
}
