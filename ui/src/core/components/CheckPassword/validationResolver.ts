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
import { CheckPassword } from 'modules/Account/interfaces/ChangePassword';
import { checkPoints } from './helpers';

interface Error {
  [key: string]: {
    type: string;
    message: string;
  };
}

export const validationResolver = (data: CheckPassword) => {
  const error: Error = {};

  forEach(checkPoints, checkPoint => {
    const isValid = checkPoint.rule(data.newPassword, data.confirmPassword);
    const field =
      checkPoint.name !== 'Confirm password'
        ? 'newPassword'
        : 'confirmPassword';

    if (!isValid) {
      error[field] = {
        type: checkPoint.name as string,
        message: checkPoint.message as string
      };
    }
  });

  return {
    values: {},
    errors: error
  };
};
