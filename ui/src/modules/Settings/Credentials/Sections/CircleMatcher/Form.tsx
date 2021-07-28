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

import React, { Fragment, useEffect, useState } from 'react';
import useForm from 'core/hooks/useForm';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { CircleMatcher } from './interfaces';
import { Props } from '../interfaces';
import { useCircleMatcher } from './hooks';
import Styled from './styled';
import ModalTrigger from 'core/components/Modal/Trigger';
import isEmpty from 'lodash/isEmpty';

const FormCircleMatcher = ({ onFinish }: Props<CircleMatcher>) => {
  const [circleMatcher, setCircleMatcher] = useState<string>();
  const isConfimation = !isEmpty(circleMatcher);
  const { responseAdd, save, loadingAdd } = useCircleMatcher();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<CircleMatcher>({
    mode: 'onChange',
  });

  useEffect(() => {
    if (responseAdd) onFinish();
  }, [onFinish, responseAdd]);

  useEffect(() => {
    if (!loadingAdd) setCircleMatcher(null);
  }, [loadingAdd]);

  const onSubmit = ({ url }: CircleMatcher) => {
    setCircleMatcher(url);
  };

  const renderConfirmation = () => (
    <ModalTrigger
      title="Add Circle Matcher"
      dismissLabel="Cancel"
      continueLabel="Yes, save"
      isLoading={loadingAdd}
      onContinue={() => save(circleMatcher)}
      onDismiss={() => setCircleMatcher(null)}
    >
      <Text tag="H4" color="light">
        This operation will syncronize all data from this workspace to the
        Circle Matcher.
      </Text>
    </ModalTrigger>
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Input
        {...register('url', { required: true })}
        label="Insert URL Circle Matcher"
      />
      <ButtonDefault type="submit" isDisabled={!isValid} isLoading={loadingAdd}>
        Save
      </ButtonDefault>
    </Styled.Form>
  );

  return (
    <Fragment>
      {isConfimation && renderConfirmation()}
      <Styled.Content>
        <Text tag="H2" color="light">
          Add Circle Matcher
          <Popover
            title="Why we ask for Circle Matcher?"
            icon="info"
            link={`${CHARLES_DOC}/reference/circle-matcher`}
            linkLabel="View documentation"
            description="Adding URL of our tool helps Charles to identify the user since this can vary from workspace to another. See our documentation for further details."
          />
        </Text>
        {renderForm()}
      </Styled.Content>
    </Fragment>
  );
};

export default FormCircleMatcher;
