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

import React, { ReactNode, useState, useRef, MouseEvent } from 'react';
import Icon from 'core/components/Icon';
import useOutsideClick from 'core/hooks/useClickOutside';
import Item from './Item';
import Styled from './styled';

interface Props {
  children: ReactNode;
  icon?: string;
  color?: 'primary' | 'dark' | 'error' | 'light' | 'medium' | 'success';
  className?: string;
}

const Dropdown = ({
  children,
  icon = 'vertical-dots',
  color = 'dark',
  className
}: Props) => {
  const [toggle, switchToggle] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => {
    switchToggle(false);
  });

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    switchToggle(!toggle);
  };

  const renderItems = () => (
    <Styled.Dropdown data-testid="dropdown-actions" className={className}>
      {children}
    </Styled.Dropdown>
  );

  return (
    <Styled.Wrapper data-testid="dropdown">
      <Icon
        ref={ref}
        name={icon}
        color={color}
        size="15px"
        className="dropdown-icon"
        onClick={(event: MouseEvent) => handleClick(event)}
      />
      {toggle && renderItems()}
    </Styled.Wrapper>
  );
};

Dropdown.Item = Item;

export default Dropdown;
