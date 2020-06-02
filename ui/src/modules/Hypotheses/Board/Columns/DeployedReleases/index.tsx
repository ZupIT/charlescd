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
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import { Column as ColumnProps } from 'modules/Hypotheses/Board/interfaces';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import Card from 'core/components/Card';
import routes from 'core/constants/routes';
import Styled from './styled';

interface Props {
  column: ColumnProps;
}

const DeployedReleases = ({ column }: Props) => {
  const history = useHistory();

  const renderDeployment = (deployment: Deployment) => (
    <Card.Circle
      key={deployment?.id}
      circle={deployment?.circle?.name}
      deployedAt={deployment?.deployedAt}
      onClick={() =>
        history.push(
          `${routes.circlesComparation}?circle=${deployment?.circle?.id}`
        )
      }
    >
      <Card.Release status={deployment?.status} description={deployment?.tag} />
    </Card.Circle>
  );

  const renderDeployments = (deployments: Deployment[]) =>
    map(deployments, (deployment: Deployment) => renderDeployment(deployment));

  const renderReleases = () =>
    map(column.builds, ({ deployments }) => renderDeployments(deployments));

  return (
    <Styled.Column full name={column.name}>
      {renderReleases()}
    </Styled.Column>
  );
};

export default DeployedReleases;
