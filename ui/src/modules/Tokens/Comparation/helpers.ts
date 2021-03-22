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

import { NEW_TAB } from 'core/components/TabPanel/constants';

export const resolveParams = (param: string) => {
  const [id, initMode] = param?.split('~');
  const mode = param === NEW_TAB ? 'edit' : 'view';
  return [id, initMode || mode];
};

export const pathModuleById = (id: string) => {
  const URL_PATH_POSITION = 0;
  const path = window.location.href.split('?')[URL_PATH_POSITION];
  return `${path}?module=${id}`;
};
