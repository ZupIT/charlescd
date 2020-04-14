import React, { ReactNode } from 'react';
import Styled from './styled';

export interface Props {
  children: ReactNode;
}

const PanelSection = ({ children }: Props) => {
  return <Styled.Section>{children}</Styled.Section>;
};

export default PanelSection;
