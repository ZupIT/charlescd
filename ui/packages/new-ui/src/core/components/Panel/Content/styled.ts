import styled, { css } from 'styled-components';

interface ContentProps {
  size: string;
}

const Content = styled.div<ContentProps>`
  background: ${({ theme }) => theme.panel.background};
  border-radius: 4px;
  padding: 0px 20px;
  overflow: auto;

  ${({ size }) =>
    size &&
    css`
      max-height: ${size};
    `};
`;

export default {
  Content
};
