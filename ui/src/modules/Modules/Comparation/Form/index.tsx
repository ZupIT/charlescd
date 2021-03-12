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

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useSaveModule, useUpdateModule } from 'modules/Modules/hooks/module';
import { Module } from 'modules/Modules/interfaces/Module';
import Can from 'containers/Can';
import { updateParam } from 'core/utils/path';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import routes from 'core/constants/routes';
import isEmpty from 'lodash/isEmpty';
import Components from './Components';
import { component } from './constants';
import Styled from './styled';
import { isRequiredAndNotBlank } from 'core/utils/validations';

interface Props {
  module: Module;
  onChange: () => void;
}

const formDefaultValues = {
  id: '',
  name: '',
  gitRepositoryAddress: '',
  helmRepository: '',
  components: [component]
};

const buildDefaultValues = (isEdit: boolean, module: Module) => 
  isEdit ? { ...module } : formDefaultValues;

const FormModule = ({ module, onChange }: Props) => {
  const { loading: saveLoading, saveModule } = useSaveModule();
  const { status: updateStatus, updateModule } = useUpdateModule();
  const isEditing = !isEmpty(module);
  const history = useHistory();

  const form = useForm<Module>({
    defaultValues: buildDefaultValues(isEditing, module),
    mode: 'onChange'
  });

  const { register, control, handleSubmit, formState: { isValid } } = form;
  const fieldArray = useFieldArray({ control, name: 'components', keyName: 'fieldId' });

  useEffect(() => {
    if (updateStatus === 'resolved') {
      onChange();
    }
  }, [updateStatus, onChange]);

  const onSubmit = (data: Module) => {
    isEditing ? updateModule(module?.id, data) : saveModule(data);
  };

  return (
    <Styled.Content>
      {isEditing && (
        <Styled.Icon
          name="arrow-left"
          color="dark"
          onClick={() =>
            updateParam(
              'module',
              routes.modulesComparation,
              history,
              module?.id,
              `${module?.id}~view`
            )
          }
        />
      )}
      <Styled.Title color="light">
        {isEditing ? 'Edit module' : 'Create module'}
        <Popover
          title="How to create a module?"
          icon="info"
          link={`${CHARLES_DOC}/get-started/creating-your-first-module`}
          linkLabel="View documentation"
          description="To configure a module you need to register a Git URL and enter the Helm repository URL. You will need to insert the components in the nex step. Consult our documentation for futher details."
        />
      </Styled.Title>
      <Styled.Subtitle color="dark">
        Enter the requested information below:
      </Styled.Subtitle>
      <FormProvider {...form}>
        <Styled.Form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Input
            label="Name the module"
            name="name"
            defaultValue={module?.name}
            ref={register(isRequiredAndNotBlank)}
          />
          <Styled.Input
            label="Module git URL"
            name="gitRepositoryAddress"
            defaultValue={module?.gitRepositoryAddress}
            ref={register(isRequiredAndNotBlank)}
          />
          {!isEditing && <Components fieldArray={fieldArray} />}
          <Styled.HelmWrapper>
            <Styled.Title color="light">
              {!isEditing
                ? 'Add helm chart repository'
                : 'Edit helm chart repository'}
            </Styled.Title>
          </Styled.HelmWrapper>
          <Styled.FieldWrapper>
            <Styled.Input
              label="Helm git URL"
              name="helmRepository"
              defaultValue={module?.gitRepositoryAddress}
              ref={register(isRequiredAndNotBlank)}
            />
          </Styled.FieldWrapper>
          <Can I="write" a="modules" isDisabled={!isValid} passThrough>
            <Styled.Button
              id="submit"
              type="submit"
              size="EXTRA_SMALL"
              isLoading={saveLoading || updateStatus === 'pending'}
            >
              {isEditing ? 'Edit module' : 'Create module'}
            </Styled.Button>
          </Can>
        </Styled.Form>
      </FormProvider>
    </Styled.Content>
  );
};

export default FormModule;
