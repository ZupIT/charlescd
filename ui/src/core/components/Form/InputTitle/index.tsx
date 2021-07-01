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
  useRef,
  useState,
  useImperativeHandle,
  ChangeEvent,
} from 'react';
import Button from 'core/components/Button';
import isEmpty from 'lodash/isEmpty';
import Styled from './styled';

interface Props {
  name: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  resume?: boolean;
  readOnly?: boolean;
  onClickSave?: () => void;
  isDisabled?: boolean;
  error?: string;
  buttonText?: string;
  buttonType?: 'button' | 'submit';
}
const InputTitle = React.forwardRef(
  (
    {
      name,
      placeholder,
      className,
      defaultValue,
      resume,
      onClickSave,
      readOnly,
      isDisabled,
      error,
      buttonText = 'Save',
      buttonType = 'button',
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>();
    const [disabled, setDisabled] = useState(true);
    const [isResumed, setIsResumed] = useState(resume);

    useImperativeHandle(ref, () => inputRef.current);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      setDisabled(isEmpty(event.currentTarget.value));
    };

    const onButtonClick = () => {
      const input = inputRef.current;
      input.blur();
      onClickSave && onClickSave();
      setIsResumed(true);
    };

    return (
      <Styled.Wrapper ref={wrapperRef} className={className}>
        <Styled.Field>
          <Styled.InputTitle
            readOnly={readOnly}
            name={name}
            ref={inputRef}
            resume={isResumed || readOnly}
            className="input-title"
            onClick={() => setIsResumed(false)}
            onChange={onChange}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
          {!isResumed && !readOnly && (
            <Button.Default
              id="input-title"
              type={buttonType}
              size="EXTRA_SMALL"
              onClick={onButtonClick}
              isDisabled={disabled || isDisabled}
            >
              {buttonText}
            </Button.Default>
          )}
        </Styled.Field>
        {error && <Styled.Error color="error">{error}</Styled.Error>}
      </Styled.Wrapper>
    );
  }
);

export default InputTitle;
