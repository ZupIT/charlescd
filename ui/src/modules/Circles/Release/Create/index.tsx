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

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormContext } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { getProfileByKey } from 'core/utils/profile';
import { validFields } from 'core/utils/validation';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import { validationResolver, formatDataModules } from './helpers';
import { ModuleForm } from '../interfaces/Module';
import { ONE, MODULE } from '../constants';
import { useComposeBuild, useCreateDeployment } from '../hooks';
import Module from './Module';
import Styled from '../styled';

const defaultValues = {
  modules: [MODULE]
};

interface Props {
  circleId: string;
  onDeployed: (deploy: Deployment) => void;
}

const CreateRelease = ({ circleId, onDeployed }: Props) => {
  const [isEmptyFields, setIsEmptyFields] = useState(true);
  const {
    composeBuild,
    response: build,
    loading: savingBuild
  } = useComposeBuild();
  const { createDeployment, response: deploy } = useCreateDeployment();
  const authorId = getProfileByKey('id');
  const form = useForm<ModuleForm>({
    defaultValues,
    mode: 'onChange',
    validationResolver
  });
  const { register, control, handleSubmit, watch, errors, getValues } = form;
  const watchFields = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modules'
  });
  const isNotUnique = fields.length > ONE;

  useEffect(() => {
    if (watchFields) {
      const isValid = validFields(watchFields);
      setIsEmptyFields(!isValid);
    }
  }, [watchFields]);

  useEffect(() => {
    if (deploy) {
      onDeployed(deploy);
    }
  }, [deploy, onDeployed]);

  useEffect(() => {
    if (build) {
      createDeployment({
        buildId: build.id,
        authorId,
        circleId
      });
    }
  }, [createDeployment, build, authorId, circleId]);

  const onSubmit = () => {
    const data = getValues({ nest: true });
    const modules = formatDataModules(data);

    composeBuild({
      modules,
      authorId,
      releaseName: data.releaseName
    });
  };

  return (
    <FormContext {...form}>
      <Styled.Form onSubmit={handleSubmit(onSubmit)}>
        <Text.h5 color="dark">Type a name for release:</Text.h5>
        <Styled.Input
          name="releaseName"
          ref={register({ required: true })}
          label="Release name"
        />
        {fields.map((module, index) => (
          <Module
            key={module.id}
            index={index}
            module={module}
            onClose={() => remove(index)}
            isNotUnique={isNotUnique}
          />
        ))}
        <Styled.Module.Info color="dark">
          You can add other modules:
        </Styled.Module.Info>
        <Styled.Module.Button
          type="button"
          isDisabled={!isEmpty(errors)}
          onClick={() => append(MODULE)}
        >
          <Icon name="add" color="dark" size="15px" /> Add modules
        </Styled.Module.Button>
        <Styled.Submit
          size="EXTRA_SMALL"
          type="submit"
          isDisabled={isEmptyFields || !isEmpty(errors)}
          isLoading={savingBuild}
        >
          deploy
        </Styled.Submit>
      </Styled.Form>
    </FormContext>
  );
};

export default CreateRelease;
