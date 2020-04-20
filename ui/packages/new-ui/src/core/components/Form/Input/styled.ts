import { Ref } from 'react';
import styled, { css } from 'styled-components';

interface InputProps {
  resume?: boolean;
  ref?: Ref<HTMLInputElement>;
}

interface WrapperProps {
  type?: string;
}
const Wrapper = styled.div<WrapperProps>`
  position: relative;
  height: 42px;
  ${({ type }) =>
    type === 'hidden' &&
    css`
      display: none;
    `};
`;

const Label = styled.label<{ isFocused: boolean }>`
  position: absolute;
  color: ${({ theme }) => theme.input.label};
  font-size: 12px;
  top: ${({ isFocused }) => (isFocused ? '0px' : '20px')};
  transition: top 0.1s, font-size 0.1s;
`;

const Input = styled.input<InputProps>`
  position: absolute;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.input.borderColor};
  box-sizing: border-box;
  font-size: 14px;
  width: 100%;
  background-color: ${({ theme }) => theme.input.background};
  color: ${({ theme }) => theme.input.color};
  padding-bottom: 5px;
  bottom: 0px;
  :focus {
    border-bottom-color: ${({ theme }) => theme.input.focus.borderColor};
  }
  :focus + ${Label} {
    top: 0px;
  }
  :disabled {
    color: ${({ theme }) => theme.input.disabled.color};
    border-bottom-color: ${({ theme }) => theme.input.disabled.borderColor};
  }
  ${({ resume }) =>
    resume &&
    css`
      background: transparent;
      border: none;
    `};
`;

export default {
  Wrapper,
  Input,
  Label
};
