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

import { Actions, Subjects } from 'core/utils/abilities';
import includes from 'lodash/includes';

export const subjectTemplate = (subject: Subjects) =>
  `Give full access to our ${subject.toLowerCase()} API`;

export const actionTemplate = (action: Actions, subject: Subjects) => {
  return action?.toLowerCase() === 'write'
    ? `Access to create, update and delete ${subject.toLowerCase()}`
    : `Access to read all ${subject.toLowerCase()} and individually as well`;
}

export const displayAction = (subject: Subjects) => {
  const subjectsWithAction: Subjects[] = ['modules', 'circles'];
  return includes(subjectsWithAction, subject);
}
