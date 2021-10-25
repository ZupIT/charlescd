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

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { isRequiredAndNotBlank } from 'core/utils/validations';
import { Deployment } from 'modules/Circles/interfaces/Circle';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button/ButtonDefault';
import ConnectionStatus from 'core/components/Message';
import Module from './Module';
import Metadata from '../Metadata';
import { ModuleForm } from '../interfaces/Module';
import { validationResolver, formatDataModules, validFields } from './helpers';
import { ONE, MODULE } from '../constants';
import { useComposeBuild, useCreateDeployment } from '../hooks';
import { Scope } from '../Metadata/interfaces';
import { toKeyValue } from '../Search/helpers';
import Styled from '../styled';

const defaultValues = {
  modules: [MODULE],
  releaseName: '',
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
    loading: savingBuild,
  } = useComposeBuild();
  const { createDeployment, response: deploy } = useCreateDeployment();
  const form = useForm<ModuleForm>({
    defaultValues,
    mode: 'onChange',
    resolver: validationResolver,
  });
  const { register, control, handleSubmit, watch, getValues, formState } = form;
  const watchFields = watch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modules',
  });
  const metadataFields = useFieldArray({ control, name: 'metadata.content' });
  const isNotUnique = fields.length > ONE;
  const [error, setError] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    if (watchFields) {
      let isValid = validFields(watchFields);
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
      const { metadata } = getValues();

      createDeployment({
        buildId: build.id,
        circleId,
        metadata: {
          scope: Scope.APPLICATION,
          content: toKeyValue(metadata),
        },
      });
    }
  }, [createDeployment, build, circleId, getValues]);

  const onSubmit = () => {
    setIsDeploying(true);
    const data = getValues();
    const modules = formatDataModules(data);

    composeBuild({
      modules,
      releaseName: data.releaseName,
    });
  };

  const checkMaxLengthError = (hasError?: boolean) => {
    if (hasError)
      setError(
        'Sum of component name and version name cannot be greater than 63 characters.'
      );
    else setError('');
  };

  return (
    <FormProvider {...form}>
      <Styled.Form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="create-release"
      >
        <Text tag="H5" color="dark">
          Type a name for release:
        </Text>
        <Styled.Input
          name="releaseName"
          ref={register(isRequiredAndNotBlank)}
          label="Release name"
        />
        {fields.map((module, index) => (
          <Module
            key={module.id}
            index={index}
            module={module}
            onClose={() => remove(index)}
            onError={checkMaxLengthError}
            isNotUnique={isNotUnique}
          />
        ))}
        <Styled.Module.Info tag="H5" color="dark">
          You can add other modules:
        </Styled.Module.Info>
        <Button
          type="button"
          size="EXTRA_SMALL"
          id="add-module"
          isDisabled={isEmptyFields}
          onClick={() => append(MODULE)}
        >
          <Icon name="add" color="dark" size="15px" /> Add modules
        </Button>
        {error && <ConnectionStatus errorMessage={error} status={'error'} />}
        <Metadata fieldArray={metadataFields} />
        <Styled.Submit
          id="submit"
          type="submit"
          size="SMALL"
          isLoading={savingBuild}
          isDisabled={!formState.isValid || isDeploying || isEmptyFields}
        >
          Deploy
        </Styled.Submit>
      </Styled.Form>
    </FormProvider>
  );
};

export default CreateRelease;
