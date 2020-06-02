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

import React from 'react';
import { Module as ModuleProps } from 'modules/Modules/interfaces/Module';
import Text from 'core/components/Text';
import Panel from 'core/components/Panel';

const Module = ({ name }: Pick<ModuleProps, 'name'>) => (
  <Panel.Section key={`${name}`}>
    <Text.h5 color="light">{`${name}`}</Text.h5>
  </Panel.Section>
);

export default Module;
