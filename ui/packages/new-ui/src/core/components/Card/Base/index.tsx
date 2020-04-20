import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: Props) => (
  <Styled.Card className={className}>{children}</Styled.Card>
);

export default Card;
