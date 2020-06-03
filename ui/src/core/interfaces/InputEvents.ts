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

import { FocusEvent, ChangeEvent } from 'react';
import { FieldElement, ValidationOptions } from 'react-hook-form';

export type ChangeInputEvent = ChangeEvent<HTMLInputElement>;

export interface InputEvents {
  onFocus?: ((event: FocusEvent<HTMLInputElement>) => void) & Function;
  onBlur?: ((event: FocusEvent<HTMLInputElement>) => void) & Function;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export type RegisterField = <Element extends FieldElement = FieldElement>(
  ref: Element,
  validationOptions?: ValidationOptions
) => void;
