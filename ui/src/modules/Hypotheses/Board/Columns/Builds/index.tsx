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
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';
import Column from 'modules/Hypotheses/Board/Column';
import {
  Column as ColumnProps,
  Build
} from 'modules/Hypotheses/Board/interfaces';
import Card from 'core/components/Card';
import useInterval from 'core/hooks/useInterval';
import { Module } from 'modules/Modules/interfaces/Module';
import { useBoard } from '../../hooks';

interface Props {
  hypothesisId: string;
  column: ColumnProps;
}

const Builds = ({ hypothesisId, column }: Props) => {
  const DELAY = 15000;
  const { getAll } = useBoard();

  useInterval(() => getAll(hypothesisId), DELAY);

  const renderModule = (module: Module) => (
    <Card.Expand.Module
      key={module.id}
      module={module}
      branch={module.gitRepositoryAddress}
    />
  );

  const renderModules = (modules: Module[]) =>
    map(modules, module => renderModule(module));

  const renderFeatures = (build: Build) => {
    const modules = flatMap(build.features, feature => feature.modules);

    return renderModules(uniqBy(modules, module => module.name));
  };

  return (
    <Column full name={column.name}>
      {map(column.builds, build => (
        <Card.Release
          key={build.id}
          status={build.status}
          description={build.tag}
        >
          {renderFeatures(build)}
        </Card.Release>
      ))}
    </Column>
  );
};

export default Builds;
