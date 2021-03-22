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

import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Can from 'containers/Can';
import { isRequiredAndNotBlank } from 'core/utils/validations';
import { Token } from 'modules/Tokens/interfaces';
import { useSave } from 'modules/Tokens/hooks';
import Text from 'core/components/Text';
import ContentIcon from 'core/components/ContentIcon';
import Button from 'core/components/Button';
import Form from 'core/components/Form';
import Styled from './styled';

const FormToken = () => {
  const { save, status } = useSave();
  const [title, setTitle] = useState<String>('');

  const { register, handleSubmit, watch, formState: { isValid } } = useForm<Token>({
    mode: 'onChange'
  });

  const name = watch('name') as string;

  const onSubmit = (token: Token) => {
    save(token);
  };

  const onAddWorkspace = () => {
    console.log('onAddWorkspace');
  }

  const onAddTitle = () => {
    console.log('handleTitle');
  }

  useEffect(() => {
    console.log('name', name)
  }, [name]);

  const Workspaces = () => (
    <ContentIcon icon="workspaces">
      <Text.h2 color="light">Associated Workspaces</Text.h2>
      <Styled.Add
        name="plus-circle"
        icon="plus-circle"
        color="dark"
        onClick={onAddWorkspace}
      >
        Add workspaces
      </Styled.Add>
    </ContentIcon>
  )

  const Scopes = () => (
    <Styled.Button
      type="submit"
      size="EXTRA_SMALL"
      isLoading={status.isPending}
    >
      Generate token
    </Styled.Button>
  )

  return (
    <Styled.Content>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <ContentIcon icon="token">
          <Form.InputTitle
            name="name"
            ref={register({ required: true })}
            onClickSave={onAddTitle}
          />
        </ContentIcon>
        <Workspaces />
        <Scopes />
      </Styled.Form>
    </Styled.Content>
  );
};

export default FormToken;
