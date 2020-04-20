import styled, { css } from 'styled-components';

interface WrapperProps {
  color?: string;
  size?: string;
}

const Wrapper = styled.div<WrapperProps>`
  display: inline-flex;
  ${({ color, theme }) =>
    color &&
    css`
      color: ${theme.icon[color] || color};
    `};

  > div > div {
    display: flex;
  }

  svg {
    ${({ size }) =>
      size &&
      css`
        width: ${size};
        height: ${size};
      `};
  }
`;

export default {
  Wrapper
};
