import React, { ReactNode } from 'react';

import Styled from './styled';

interface Props {
  children: ReactNode;
  className?: string;
}

const Page = ({ children, className }: Props) => (
  <Styled.Page data-testid="page" className={className}>
    {children}
  </Styled.Page>
);

Page.Menu = ({ children, className }: Props) => (
  <Styled.Menu data-testid="page-menu" className={className}>
    {children}
  </Styled.Menu>
);

Page.Content = ({ children, className }: Props) => (
  <Styled.Content data-testid="page-content" className={className}>
    {children}
  </Styled.Content>
);

export default Page;
