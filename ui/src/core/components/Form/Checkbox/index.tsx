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
  Fragment,
  Ref,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react';
import Styled from './styled';

interface Props {
  name?: string;
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

const Checkbox = forwardRef(
  (
    {
      name,
      value,
      label,
      description,
      disabled,
      defaultChecked,
      onChange,
      className,
      ...rest
    }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => checkboxRef.current);

    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(event.target.checked);
    };

    const renderDescription = () => (
      <Styled.Description color="dark">{description}</Styled.Description>
    );

    return (
      <Fragment>
        <Styled.Checkbox className={className}>
          <Styled.Input
            type="checkbox"
            data-testid={`checkbox-input-${label}`}
            disabled={disabled}
            ref={checkboxRef}
            name={name}
            value={value}
            onChange={onCheck}
            defaultChecked={defaultChecked}
            {...rest}
          />
          <Styled.Toggle data-testid={`checkbox-toggle-${label}`} />
          {label && <Styled.Label data-testid={`checkbox-${label}`} color="light">
            {label}
          </Styled.Label>}
        </Styled.Checkbox>

        {description && renderDescription()}
      </Fragment>
    );
  }
);

export default Checkbox;
