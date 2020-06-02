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

import React, { ReactNode, useState, useRef } from 'react';
import map from 'lodash/map';
import Icon from 'core/components/Icon';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export interface Action {
  icon?: string;
  label: string;
  name: string;
}

export interface Props {
  children: ReactNode;
  actions: Action[];
  active?: string;
  onSelect: (name: string) => void;
  isDisabled?: boolean;
}

const Menu = ({
  children,
  actions,
  active,
  onSelect,
  isDisabled,
  ...rest
}: Props) => {
  const [toggle, switchToggle] = useState(false);
  const menuRef = useRef<HTMLDivElement>();

  useOutsideClick(menuRef, () => {
    switchToggle(!toggle);
  });

  const handleSelect = (name: string) => {
    switchToggle(!toggle);
    onSelect(name);
  };

  const renderActions = () =>
    map(actions, ({ icon, label, name }: Action) => (
      <Styled.Action key={name} onClick={() => handleSelect(name)}>
        <Styled.WrapperIcon>
          {name === active && (
            <Styled.Icon size="15px" color="light" name="checkmark" />
          )}
          {icon && <Icon name={icon} />}
        </Styled.WrapperIcon>
        <Styled.H5 color="dark">{label}</Styled.H5>
      </Styled.Action>
    ));

  return (
    <Styled.Wrapper isDisabled={isDisabled} {...rest}>
      <Styled.Content onClick={() => switchToggle(!toggle)}>
        {children}
      </Styled.Content>
      {!isDisabled && toggle && (
        <Styled.Actions ref={menuRef}>{renderActions()}</Styled.Actions>
      )}
    </Styled.Wrapper>
  );
};

export default Menu;
