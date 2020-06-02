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

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import Form from 'core/components/Form';
import Button from 'core/components/Button';
import { getProfileByKey } from 'core/utils/profile';
import { useGenerateRelease } from 'modules/Hypotheses/Board/hooks';
import { createReleaseName } from './helpers';
import Styled from './styled';

interface Props {
  hypothesisId: string;
  features: string[];
  onClose: Function;
}

const ModalGenerateRelease = ({ features, hypothesisId, onClose }: Props) => {
  const MAX_LENGTH_NAME = 50;
  const { response, loading, generate } = useGenerateRelease();
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, watch, handleSubmit } = useForm();
  const watchTagName = watch('tagName');

  useEffect(() => {
    setIsDisabled(isEmpty(watchTagName));
  }, [watchTagName]);

  useEffect(() => {
    if (response) {
      onClose();
    }
  }, [response, onClose]);

  const onSubmit = ({ tagName }: Record<string, string>) => {
    generate({
      authorId: getProfileByKey('id'),
      features,
      hypothesisId,
      tagName: createReleaseName(tagName)
    });
  };

  return (
    <Styled.Modal onClose={() => onClose()}>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Text.h2 color="light">Type a name for the release</Text.h2>
        <Form.Input
          name="tagName"
          maxLength={MAX_LENGTH_NAME}
          label="Type a name:"
          ref={register({ required: true, maxLength: MAX_LENGTH_NAME })}
        />
        <Button.Default
          type="submit"
          isDisabled={isDisabled}
          isLoading={loading}
        >
          Generate release
        </Button.Default>
      </Styled.Form>
    </Styled.Modal>
  );
};

export default ModalGenerateRelease;
