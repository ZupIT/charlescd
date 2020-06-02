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
import { useForm } from 'react-hook-form';

interface Props {
  name: string;
  onSave: (name: string) => void;
}

const LayerName = ({ name, onSave }: Props) => {
  const { register, handleSubmit, getValues } = useForm();

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
            ref={register}
            onClickSave={onSubmit}
            placeholder="Type a name"
            defaultValue={name}
            resume
          />
        </form>
      </ContentIcon>
    </Styled.Layer>
  );
};
export default LayerName;
