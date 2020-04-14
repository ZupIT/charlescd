import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  children: ReactNode;
  size?: string;
}

const PanelContent = ({ size = '316px', children }: Props) => (
  <Styled.Content size={size}>{children}</Styled.Content>
);

export default PanelContent;
