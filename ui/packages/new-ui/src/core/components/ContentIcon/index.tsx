import React, { ReactNode } from 'react';
import Icon from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  icon: string;
  className?: string;
}

const ContentIcon = ({ children, icon, className }: Props) => (
  <Styled.Wrapper data-testid={`contentIcon-${icon}`} className={className}>
    <Icon color="dark" name={icon} size="22px" />
    <Styled.Content>{children}</Styled.Content>
  </Styled.Wrapper>
);

export default ContentIcon;
