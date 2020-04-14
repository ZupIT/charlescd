import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CardBody = ({ children, className, onClick }: Props) => (
  <Styled.CardBody className={className} onClick={onClick}>
    {children}
  </Styled.CardBody>
);

export default CardBody;
