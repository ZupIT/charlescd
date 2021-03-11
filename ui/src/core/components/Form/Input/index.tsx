/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
  Ref,
  useRef,
  useImperativeHandle,
  useState,
  FocusEvent,
  useEffect
} from 'react';
import Popover from 'core/components/Popover';
import { InputEvents, ChangeInputEvent } from 'core/interfaces/InputEvents';
import isEmpty from 'lodash/isEmpty';
import Styled from './styled';

export interface Props extends InputEvents {
  id?: string;
  className?: string;
  resume?: boolean;
  readOnly?: boolean;
  type?: string;
  name?: string;
  label?: string;
  tipTitle?: string;
  tipDescription?: string;
  maxLength?: number;
  autoComplete?: string;
  defaultValue?: string;
  onChange?: (event: ChangeInputEvent) => void;
  onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  error?: string;
}

const Input = React.forwardRef(
  (
    {
      name,
      label,
      className,
      type = 'text',
      tipTitle,
      tipDescription,
      disabled = false,
      readOnly = false,
      autoComplete = 'off',
      onChange,
      maxLength,
      isLoading,
      hasError,
      error,
      ...rest
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isTip = !isEmpty(tipTitle) && !isEmpty(tipDescription);
    const [isFocused, setIsFocused] = useState(true);

    const value = inputRef?.current?.value;

    useEffect(() => {
      const isEmptyValue = isEmpty(inputRef.current.value);
      setIsFocused(!isEmptyValue || disabled);
    }, [rest.defaultValue, disabled, value]);

    const renderTip = () => (
      <Popover title={tipTitle} icon="info" description={tipDescription} />
    );

    useImperativeHandle(ref, () => inputRef.current);

    const handleChange = (event: ChangeInputEvent) => {
      setIsFocused(!isEmpty(event.currentTarget.value));
      onChange && onChange(event);
    };

    const handleFocused = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocused(!isEmpty(event.currentTarget.value));
    };

    const handleClick = () => {
      inputRef.current.focus();
      setIsFocused(true);
    };

    return (
      <Styled.Wrapper
        type={type}
        className={className}
        data-testid={`input-wrapper-${name}`}
      >
        <Styled.Input
          id={`input-${type}-${name}`}
          ref={inputRef}
          type={type}
          name={name}
          readOnly={readOnly}
          maxLength={maxLength}
          data-testid={`input-${type}-${name}`}
          autoComplete={autoComplete}
          onChange={handleChange}
          onClick={() => setIsFocused(true)}
          onBlur={handleFocused}
          disabled={disabled}
          hasError={hasError || !isEmpty(error)}
          {...rest}
        />
        {label && (
          <Styled.Label
            data-testid={`label-${type}-${name}`}
            isFocused={isFocused}
            hasError={hasError || !isEmpty(error)}
            onClick={() => handleClick()}
            htmlFor={`input-${type}-${name}`}
          >
            {label}
          </Styled.Label>
        )}
        {error && <Styled.Error color="error">{error}</Styled.Error>}
        {isLoading && <Styled.Loading name="ellipse-loading" color="light" />}
        {isTip && <Styled.Tip>{renderTip()}</Styled.Tip>}
      </Styled.Wrapper>
    );
  }
);

export default Input;
