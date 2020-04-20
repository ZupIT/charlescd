import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  icon: string;
  marginContent?: string;
  size?: string;
  className?: string;
}

const LabeledIcon = ({
  children,
  icon,
  className,
  size = '15px',
  marginContent = '5px'
}: Props) => {
  return (
    <Styled.Wrapper className={className} data-testid={`labeledIcon-${icon}`}>
      <Styled.Icon name={icon} size={size} />
      <Styled.Label marginContent={marginContent}>{children}</Styled.Label>
    </Styled.Wrapper>
  );
};

export default LabeledIcon;
