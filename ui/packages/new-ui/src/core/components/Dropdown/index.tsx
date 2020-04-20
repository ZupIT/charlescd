import React, { useState, useRef } from 'react';
import map from 'lodash/map';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import Text from 'core/components/Text';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export interface Action {
  icon?: string;
  name: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface Props {
  actions: Action[];
}

const Dropdown = ({ actions }: Props) => {
  const [toggle, switchToggle] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => {
    switchToggle(!toggle);
  });

  const handleClick = (onClick: Function) => {
    switchToggle(!toggle);
    onClick();
  };

  const renderItem = ({ icon, name, onClick }: Action) => (
    <Styled.Item
      key={`dropdown-item-${icon}${name}`}
      onClick={() => handleClick(onClick)}
    >
      {icon && <Icon name={icon} />}
      <Text.h5 color="dark">{name}</Text.h5>
    </Styled.Item>
  );

  const renderItems = () => (
    <Styled.Dropdown ref={ref} data-testid="dropdown-actions">
      {map(actions, action => renderItem(action))}
    </Styled.Dropdown>
  );

  return (
    <Styled.Wrapper data-testid="dropdown">
      <Button.Icon
        name="vertical-dots"
        color="dark"
        size="15px"
        onClick={() => switchToggle(!toggle)}
      />
      {toggle && renderItems()}
    </Styled.Wrapper>
  );
};

export default Dropdown;
