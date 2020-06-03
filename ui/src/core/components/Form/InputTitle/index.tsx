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

import React, { useRef, useState, Ref, useImperativeHandle } from 'react';
import Button from 'core/components/Button';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

interface Props {
  name: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  resume?: boolean;
  readOnly?: boolean;
  onClickSave?: () => void;
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
      readOnly
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>();
    const [isResumed, setIsResumed] = useState(resume);

    useOutsideClick(wrapperRef, () => setIsResumed(true));

    useImperativeHandle(ref, () => inputRef.current);

    const onButtonClick = () => {
      const input = inputRef.current;
      input.blur();
      onClickSave && onClickSave();
      setIsResumed(true);
    };

    return (
      <Styled.Wrapper ref={wrapperRef}>
        <Styled.InputTitle
          readOnly={readOnly}
          name={name}
          ref={inputRef}
          resume={isResumed || readOnly}
          className={className}
          onClick={() => setIsResumed(false)}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
        {!isResumed && !readOnly && (
          <Button.Default
            type="submit"
            size="EXTRA_SMALL"
            onClick={onButtonClick}
          >
            Save
          </Button.Default>
        )}
      </Styled.Wrapper>
    );
  }
);

export default InputTitle;
