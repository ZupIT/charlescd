import React from 'react';
import styled from 'styled-components';
import IconComponent, { Props as IconProps } from 'core/components/Icon';
import InputComponent from 'core/components/Form/Input';

interface Props extends IconProps {
  isFocused?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled((props: Props) => {
  const devProps = { ...props };
  delete devProps.isFocused;

  return <IconComponent {...devProps} />;
})<Props>`
  cursor: text;
  color: ${({ theme, isFocused }) => {
    return isFocused
      ? theme.input.search.focus.color
      : theme.input.search.color;
  }};
`;

const Input = styled(InputComponent)`
  width: 100%;
  height: 39px;

  input {
    padding: 12px 12px 12px 5px;
    font-size: 12px;
  }
`;

export default {
  Wrapper,
  Icon,
  Input
};
