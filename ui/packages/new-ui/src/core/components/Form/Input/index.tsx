import React, { Ref, useState } from 'react';
import { ChangeInputEvent, InputEvents } from 'core/interfaces/InputEvents';
import isEmpty from 'lodash/isEmpty';
import Styled from './styled';

export interface Props extends InputEvents {
  id?: string;
  className?: string;
  resume?: boolean;
  type?: string;
  name?: string;
  label?: string;
  autoComplete?: string;
  defaultValue?: string;
  onChange?: (event: ChangeInputEvent) => void;
  disabled?: boolean;
}

const Input = React.forwardRef(
  (
    {
      name,
      label,
      onChange,
      className,
      type = 'text',
      disabled = false,
      autoComplete = 'off',
      ...rest
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const [isFocused, setIsFocused] = useState(!isEmpty(rest.defaultValue));

    const handleChange = (event: ChangeInputEvent) => {
      setIsFocused(!isEmpty(event.currentTarget.value));

      if (onChange) {
        onChange(event);
      }
    };

    return (
      <Styled.Wrapper type={type} className={className}>
        <Styled.Input
          ref={ref}
          type={type}
          name={name}
          data-testid={`input-${name}`}
          autoComplete={autoComplete}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        {label && <Styled.Label isFocused={isFocused}>{label}</Styled.Label>}
      </Styled.Wrapper>
    );
  }
);

export default Input;
