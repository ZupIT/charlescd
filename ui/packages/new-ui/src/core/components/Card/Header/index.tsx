import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  icon?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
}

const CardHeader = ({ icon, children, action }: Props) => {
  const renderIcon = () => <Styled.Icon>{icon}</Styled.Icon>;

  const renderAction = () => <Styled.Action>{action}</Styled.Action>;

  return (
    <Styled.CardHeader>
      {icon && renderIcon()}
      {children}
      {action && renderAction()}
    </Styled.CardHeader>
  );
};

export default CardHeader;
