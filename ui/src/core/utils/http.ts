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

import inRange from 'lodash/inRange';
import { HTTP_STATUS } from 'core/enums/HttpStatus';

export const isErrorCode = (httpCode: number) => inRange(httpCode, 400, 599);

export const themeByHttpCode = (httpCode: number) => {
  if (httpCode === HTTP_STATUS.teapot) {
    return 'primary'
  } else if (isErrorCode(httpCode)) {
    return 'error'
  } else {
    return 'success'
  }
};
