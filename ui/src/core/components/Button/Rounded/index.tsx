import React from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';
import { PrimaryColors } from 'core/interfaces/PrimaryColors';

export interface Props {
  children: string;
  isLoading?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  name?: string;
  icon?: string;
  color?: PrimaryColors;
  isDisabled?: boolean;
}

const ButtonRounded = ({
  children,
  name,
  icon,
  color,
  onClick,
  isLoading,
  className,
  isDisabled,
  ...rest
}: Props) => (
  <Styled.Button
    {...rest}
    data-testid={`button-iconRounded-${name}`}
    onClick={onClick}
    disabled={isLoading || isDisabled}
    className={className}
  >
    {isLoading ? (
      <Icon name="loading" size="15px" color={color} />
    ) : (
      icon && <Icon name={icon} size="15px" color={color} />
    )}
    <Text.h5 color={color} weight="bold" align="left">
      {children}
    </Text.h5>
  </Styled.Button>
);

export default ButtonRounded;
