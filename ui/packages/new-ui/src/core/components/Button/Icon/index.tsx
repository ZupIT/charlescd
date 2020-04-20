import React from 'react';
import Icon, { Props as IIconProps } from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const ButtonIcon = ({ onClick, name, size, color }: Props & IIconProps) => (
  <Styled.Button data-testid={`button-icon-${name}`} onClick={onClick}>
    <Icon name={name} size={size} color={color} />
  </Styled.Button>
);

export default ButtonIcon;
