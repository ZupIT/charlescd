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

import React from 'react';
import ContentIcon from 'core/components/ContentIcon';
import Styled from '../styled';
import useForm from 'core/hooks/useForm';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import { isRequired, maxLength } from 'core/utils/validations';

interface Props {
  name: string;
  isDefault: boolean;
  onSave: (name: string) => void;
}

type FormValues = {
  name: string;
}

const LayerName = ({ name, onSave, isDefault }: Props) => {
  const { register, handleSubmit, getValues, errors } = useForm<FormValues>({
    mode: 'onChange'
  });

  const onSubmit = () => {
    const { name } = getValues();
    onSave(name?.trim());
  };

  return (
    <Styled.Layer>
      <ContentIcon icon="circles">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.InputTitle
            name="name"
            ref={register({
              required: isRequired(),
              maxLength: maxLength()
            })}
            onClickSave={onSubmit}
            placeholder="Type a name"
            defaultValue={name}
            isDisabled={!!errors.name}
            resume
            readOnly={isDefault}
          />
          {errors.name && (
            <Styled.FieldErrorWrapper>
              <Icon name="error" color="error" />
              <Text.h6 color="error">{errors.name.message}</Text.h6>
            </Styled.FieldErrorWrapper>
          )}
        </form>
      </ContentIcon>
    </Styled.Layer>
  );
};
export default LayerName;
