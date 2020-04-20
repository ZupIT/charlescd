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
}

const Menu = ({ children, actions, active, onSelect }: Props) => {
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
          {name === active && <Styled.Icon color="white" name="checkmark" />}
          {icon && <Icon name={icon} />}
        </Styled.WrapperIcon>
        <Styled.H5 color="dark">{label}</Styled.H5>
      </Styled.Action>
    ));

  return (
    <Styled.Wrapper>
      <Styled.Content onClick={() => switchToggle(!toggle)}>
        {children}
      </Styled.Content>
      {toggle && (
        <Styled.Actions ref={menuRef}>{renderActions()}</Styled.Actions>
      )}
    </Styled.Wrapper>
  );
};

export default Menu;
