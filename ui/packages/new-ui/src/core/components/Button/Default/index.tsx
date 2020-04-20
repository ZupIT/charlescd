import React from 'react';
import Styled from './styled';

export interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  id?: string;
}

const Button = ({ children, onClick, className, id }: Props) => {
  return (
    <Styled.Button
      data-testid={`button-default-${id}`}
      className={className}
      onClick={onClick}
    >
      {children}
    </Styled.Button>
  );
};

export default Button;
