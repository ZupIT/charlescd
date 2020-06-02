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

import { CreateCircleWithFilePayload } from './interfaces/Circle';
import { getProfileByKey } from 'core/utils/profile';

export const buildFormData = ({
  file,
  keyName,
  name
}: CreateCircleWithFilePayload) => {
  const payload = new FormData();
  payload.append('authorId', getProfileByKey('id'));
  payload.append('name', name);
  file && payload.append('file', file);
  keyName && payload.append('keyName', keyName);

  return payload;
};
