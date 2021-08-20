/*
 * Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import React, { } from 'react';
import { useFormContext, ArrayField } from 'react-hook-form';
import Styled from '../styled';
import { isRequiredAndNotBlank } from 'core/utils/validations';

interface Props {
  index: number;
  onClose: () => void;
  isNotUnique?: boolean;
  metadata?: Partial<ArrayField<Record<string, string>, 'id'>>;
}

const Metadata = ({ index, onClose, isNotUnique }: Props) => {
  const prefixName = `metadata[${index}]`;
  const {
    register,
  } = useFormContext();

  return (
    <>
      <Styled.Metadata.Wrapper>
        {isNotUnique && (
          <Styled.Module.Trash>
            <Styled.Module.Icon
              name="trash"
              color="light"
              onClick={() => onClose()}
            />
          </Styled.Module.Trash>
        )}
        <Styled.InputWrapper>
          <Styled.Metadata.Input
            name={`${prefixName}.key`}
            ref={register(isRequiredAndNotBlank)}
            label="Type a key"
          />
        </Styled.InputWrapper>
        <Styled.InputWrapper>
          <Styled.Metadata.Input
            name={`${prefixName}.value`}
            ref={register(isRequiredAndNotBlank)}
            label="Type a value"
          />
        </Styled.InputWrapper>
      </Styled.Metadata.Wrapper>
      <Styled.Metadata.Checkbox 
        name={`${prefixName}.cluster`}
        value="false"
        label="Add to cluster."
      />
    </>
  );
};

export default Metadata;
