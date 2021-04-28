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

import React, { MouseEvent, Fragment } from 'react';
import Styled from './styled';

export interface Props {
  id?: string;
  icon?: string;
  name: string;
  onClick?: (event: MouseEvent) => void;
  onSelect?: (name: string) => void;
  className?: string;
  isInactive?: boolean;
  tooltip?: string;
}

const DropdownItem = ({
  id,
  icon,
  name,
  onClick,
  onSelect,
  className,
  isInactive,
  tooltip,
  ...rest
}: Props) => {
  const handleClick = (event: MouseEvent) => {
    if (!isInactive) {
      onClick && onClick(event);
      onSelect && onSelect(name);
    }
  };

  return (
    <Fragment>
      <Styled.Item
        key={`dropdown-item-${icon}-${name}`}
        data-testid={`dropdown-item-${icon}-${name}`}
        className={className}
        onClick={(event: MouseEvent) => handleClick(event)}
        isInactive={isInactive}
        data-tip={tooltip}
        data-for={id}
        {...rest}
      >
        {icon && <Styled.Icon name={icon} size="15px" />}
        <Styled.Text color="dark">{name}</Styled.Text>
      </Styled.Item>
      {isInactive && (
        <Styled.ReactTooltipStyled
          id={id}
          place="right"
          effect="solid"
          multiline={true}
          delayHide={300}
        />
      )}
    </Fragment>
  );
};

export default DropdownItem;
