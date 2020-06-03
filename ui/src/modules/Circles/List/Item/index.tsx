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

import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CircleHealth } from '../HealthVariation/interfaces';
import healthVariationWorker from '../HealthVariation/worker';
import CircleHealthCard from '../HealthVariation/index';
import Card from 'core/components/Card';
import useWorker from 'core/hooks/useWorker';
import { troubleText } from './constants';
import { getTroubleComponentsAmount } from './helpers';
import { addParam } from 'core/utils/path';
import { CirclePaginationItem } from 'modules/Circles/interfaces/CirclesPagination';
import routes from 'core/constants/routes';
import Styled from './styled';
import { isDefaultCircle } from 'modules/Circles/Comparation/Item/helpers';

const CirclesListItem = ({ id, name, deployment }: CirclePaginationItem) => {
  const history = useHistory();
  const [circleHealthData, workerHook] = useWorker<CircleHealth>(
    healthVariationWorker
  );

  useEffect(() => {
    workerHook({ id });
  }, [id, workerHook, name]);

  const renderStatus = () => {
    const componentsTroubleAmount = getTroubleComponentsAmount(
      circleHealthData
    );

    const troubleType =
      componentsTroubleAmount?.status === troubleText.status
        ? troubleText.warning
        : troubleText.error;

    return (
      componentsTroubleAmount && (
        <Styled.IconTrouble
          title={`${componentsTroubleAmount.value} components are ${troubleType} the limit`}
          name={componentsTroubleAmount.status}
          color={componentsTroubleAmount.status}
        />
      )
    );
  };

  return (
    <Styled.Wrapper
      onClick={() => addParam('circle', routes.circlesComparation, history, id)}
    >
      <Card.Circle key={id} circle={name} deployedAt={deployment?.deployedAt}>
        {circleHealthData && renderStatus()}
        <Styled.ReleaseWrapper>
          <Card.Release
            status={deployment?.status}
            description={deployment?.tag}
          />
        </Styled.ReleaseWrapper>
        {!isDefaultCircle(name) && (
          <CircleHealthCard
            id={id}
            name={name}
            circleHealthData={circleHealthData}
          />
        )}
      </Card.Circle>
    </Styled.Wrapper>
  );
};

export default memo(CirclesListItem);
