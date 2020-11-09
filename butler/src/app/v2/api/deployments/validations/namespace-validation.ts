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
import { plainToClass } from 'class-transformer'
import { CreateComponentRequestDto } from '../dto/create-component-request.dto'

@ValidatorConstraint({ name: 'namespace', async: false })
export class NamespaceValidation implements ValidatorConstraintInterface {

  public validate(namespace: string): boolean {
    return namespace != null

  }
  public defaultMessage(args: ValidationArguments) {
    const component = plainToClass(CreateComponentRequestDto, args.object)
    return `Namespace is not defined! Edit the configuration of component '${component.componentName}' `
  }

}
