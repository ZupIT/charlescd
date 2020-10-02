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
import { useForm } from 'react-hook-form';
import Modal from 'core/components/Modal';
import { useCreateMetricsGroup } from './hooks';
import Styled from './styled';
import { MetricsGroup } from './types';
import { isNotBlank } from 'core/utils/validation';

interface Props {
  id: string;
  onCloseModal: Function;
  onSaveGroup: Function;
  metricGroup?: MetricsGroup;
}

const AddMetricsGroup = ({
  id,
  onCloseModal,
  onSaveGroup,
  metricGroup
}: Props) => {
  const { createMetricsGroup, status } = useCreateMetricsGroup(metricGroup?.id);

  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({ mode: 'onChange', defaultValues: metricGroup ?? {} });

  const onSubmit = ({ name }: Partial<MetricsGroup>) => {
    createMetricsGroup(name, id).then(response => {
      if (response) {
        onSaveGroup();
      }
    });
  };

  return (
    <Modal.Default onClose={() => onCloseModal()}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Styled.Modal.Title color="light">Add metrics group</Styled.Modal.Title>
        <Styled.Modal.Input
          name="name"
          label="Type a name for the metrics group"
          ref={register({
            required: true,
            validate: isNotBlank
          })}
          maxLength={100}
        />
        <Styled.Modal.Button
          type="submit"
          isDisabled={!isValid}
          isLoading={status.isPending}
        >
          Save group
        </Styled.Modal.Button>
      </form>
    </Modal.Default>
  );
};

export default AddMetricsGroup;
