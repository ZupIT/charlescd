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
import { countBy } from 'lodash'


@ValidatorConstraint({ name: 'componentUniqueByProp', async: false })
export class ComponentUniqueProp implements ValidatorConstraintInterface {

  public validate(components: CreateComponentRequestDto[], args: ValidationArguments): boolean {
    const countByProp = countBy(components, args.constraints[0])
    return Object.values(countByProp).every(n => n === 1)
  }

  public defaultMessage(args: ValidationArguments) : string {
    return `Duplicated components with the property '${args.constraints[0]}'`
  }
}
