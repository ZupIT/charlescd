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

import React, { useState } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { PrimaryColors } from 'core/interfaces/color';
import { usePrevious } from 'core/hooks/usePrevious';
import { DEFAULT_CIRCLE_NAME } from 'modules/Circles/constants';
import { getVariationStatus } from './helpers';
import { GROWING_STATUS } from './enums';
import ModuleItem from './moduleItem';
import { CircleHealthType } from '../interfaces';
import Styled from './styled';

interface Props {
  type: string;
  health: CircleHealthType;
  id: string;
  name: string;
  className?: string;
}

const HealthCard = ({ type, health, name, className }: Props) => {
  const isDefault = name === DEFAULT_CIRCLE_NAME;
  const [isExpanded, setIsExpanded] = useState(false);
  const firstComponent = health?.circleComponents[0];
  const prevVariation = usePrevious(firstComponent?.value);
  const growingStatus = getVariationStatus(
    prevVariation,
    firstComponent?.value
  );

  const renderTitle = () => (
    <Styled.Title>
      <Text.h5 color="light">{name}</Text.h5>
      <Styled.Icon
        name="collapse"
        color="grey"
        onClick={() => setIsExpanded(false)}
      />
    </Styled.Title>
  );

  const renderBody = () => (
    <Styled.Body isExpanded={isExpanded} isDefault={isDefault}>
      {!isExpanded !== isDefault ? (
        <Text.h5 title={firstComponent?.name} color="light">
          {firstComponent?.name}
        </Text.h5>
      ) : (
        <Styled.ModuleCardView>
          {health?.circleComponents.map((item, index) => (
            <ModuleItem
              health={item}
              unit={health?.unit}
              key={index}
              isDefault={isDefault}
            />
          ))}
        </Styled.ModuleCardView>
      )}
    </Styled.Body>
  );

  return (
    <Styled.Wrapper
      className={className}
      isExpanded={isExpanded}
      isDefault={isDefault}
    >
      <div>
        {isExpanded && renderTitle()}
        <Styled.Header isExpanded={isExpanded}>
          <Text.h5 color="light">{type}</Text.h5>
          <Styled.Variation>
            {growingStatus === GROWING_STATUS.NORMAL ? (
              <Styled.StableIcon
                name={`variation-${growingStatus?.toLowerCase()}`}
                color="grey"
              />
            ) : (
              <Icon
                name={`variation-${growingStatus?.toLowerCase()}`}
                color="grey"
              />
            )}
            <Text.h5
              color={firstComponent?.status?.toLowerCase() as PrimaryColors}
            >
              {firstComponent?.value} {health?.unit}
            </Text.h5>
          </Styled.Variation>
          <Text.h5 color="dark">
            Limit {firstComponent?.threshold} {health?.unit}
          </Text.h5>
          {!isExpanded && !isDefault && (
            <Styled.Icon
              name="expand"
              color="grey"
              onClick={() => setIsExpanded(true)}
            />
          )}
        </Styled.Header>
      </div>
      {renderBody()}
    </Styled.Wrapper>
  );
};

export default HealthCard;
