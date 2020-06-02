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

import React, { MouseEvent } from 'react';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  icon?: string;
  name: string;
  onClick?: (event: MouseEvent) => void;
  onSelect?: (name: string) => void;
  className?: string;
}

const DropdownItem = ({
  icon,
  name,
  onClick,
  onSelect,
  className,
  ...rest
}: Props) => {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onClick && onClick(event);
    onSelect && onSelect(name);
  };

  return (
    <Styled.Item
      key={`dropdown-item-${icon}${name}`}
      className={className}
      onClick={(event: MouseEvent) => handleClick(event)}
      {...rest}
    >
      {icon && <Icon name={icon} size="15px" />}
      <Text.h5 color="dark">{name}</Text.h5>
    </Styled.Item>
  );
};

export default DropdownItem;
