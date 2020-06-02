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

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'core/components/Button';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { CircleMatcher } from './interfaces';
import { Props } from '../interfaces';
import { useCircleMatcher } from './hooks';
import Styled from './styled';

const FormCircleMatcher = ({ onFinish }: Props) => {
  const { responseAdd, save, loadingAdd } = useCircleMatcher();
  const { register, handleSubmit } = useForm<CircleMatcher>();

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  const onSubmit = ({ url }: CircleMatcher) => {
    save(url);
  };

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Input
        ref={register({ required: true })}
        name="url"
        label="Insert URL Circle Matcher"
      />
      <Button.Default type="submit" isLoading={loadingAdd}>
        Save
      </Button.Default>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light">
        Add Circle Matcher
        <Popover
          title="Why we ask for Circle Matcher?"
          icon="info"
          link={`${CHARLES_DOC}/referencia-1/circle-matcher`}
          linkLabel="View documentation"
          description="Adding URL of our tool helps Charles to identify the user since this can vary from workspace to another. Consult the our documentation for further details."
        />
      </Text.h2>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormCircleMatcher;
