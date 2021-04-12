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

import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

export const validFields = (fields: object) => {
  let status = true;
  forEach(fields, (value: string) => {
    if (isEmpty(value)) {
      status = false;
    }
  });

  return status;
};

export const isNotBlank = (value: string | any) => {
  if (value && isString(value)) {
    return !!value.trim() || 'No whitespaces'
  }
  return value;
}

export const trimValue = (value: unknown) => isString(value) ? value?.trim() : value;

export const isRequiredAndNotBlank = {
  required: true,
  validate: {
    notBlank: isNotBlank
  },
  setValueAs: trimValue
} as const;

export const maxLength = (value = 64, message?: string) => ({
  value: value,
  message: message || `The maximum value of this field is ${value}.`
});

export const minLength = (value: number, message?: string) => ({
  value: value,
  message: message || `The minimum value of this field is ${value}.`
});

export const isRequired = () => ({
  value: true,
  message: 'This field is required'
});

export const emailPattern = () => ({
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: 'Entered value does not match email format.'
});

export const urlPattern = () => ({
  value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
  message: 'Entered value does not match URL format with HTTP/HTTPS protocol.'
});

export const atLeastOne = (values: string[]) =>
  values?.length ? true : 'At least one must be checked';