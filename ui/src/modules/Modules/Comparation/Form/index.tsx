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
import { useHistory } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import { useForm, useFieldArray, FormContext } from 'react-hook-form';
import { useSaveModule, useUpdateModule } from 'modules/Modules/hooks/module';
import { Module } from 'modules/Modules/interfaces/Module';
import { getProfileByKey } from 'core/utils/profile';
import Can from 'core/components/Can';
import { updateParam } from 'core/utils/path';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import routes from 'core/constants/routes';
import isEmpty from 'lodash/isEmpty';
import Components from './Components';
import { component } from './constants';
import { validFields } from './helpers';
import Styled from './styled';

interface Props {
  module: Module;
  onChange: Function;
}

const FormModule = ({ module, onChange }: Props) => {
  const { loading: saveLoading, saveModule } = useSaveModule();
  const { status: updateStatus, updateModule } = useUpdateModule();
  const authorId = getProfileByKey('id');
  const isEdit = !isEmpty(module);
  const [isDisabled, setIsDisabled] = useState(true);
  const history = useHistory();

  const form = useForm<Module>({
    defaultValues: { components: [component] }
  });

  const { register, control, getValues, handleSubmit, watch } = form;
  const fieldArray = useFieldArray({ control, name: 'components' });
  const watchFields = watch();

  useEffect(() => {
    const form = getValues();
    const isInvalid = !validFields(form);
    const mod = {
      name: module?.name,
      gitRepositoryAddress: module?.gitRepositoryAddress,
      helmRepository: module?.helmRepository
    };

    setIsDisabled(isEqual(mod, form) || isInvalid);
  }, [watchFields, getValues, module]);

  useEffect(() => {
    if (updateStatus === 'resolved') {
      onChange();
    }
  }, [updateStatus, onChange]);

  const onSubmit = (data: Module) => {
    if (isEdit) {
      updateModule(module?.id, data);
    } else {
      saveModule({ ...data, authorId });
    }
  };

  return (
    <Styled.Content>
      {isEdit && (
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
        {isEdit ? 'Edit module' : 'Create module'}
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
      <FormContext {...form}>
        <Styled.Form onSubmit={handleSubmit(onSubmit)}>
          <Styled.Input
            label="Name the module"
            name="name"
            defaultValue={module?.name}
            ref={register({ required: true })}
          />
          <Styled.Input
            label="URL git"
            name="gitRepositoryAddress"
            defaultValue={module?.gitRepositoryAddress}
            ref={register({ required: true })}
          />
          {!isEdit && <Components fieldArray={fieldArray} />}
          <Styled.FieldPopover>
            <Styled.Input
              label="Insert a helm repository link"
              name="helmRepository"
              defaultValue={module?.helmRepository}
              ref={register({ required: true })}
            />
            <Styled.Popover
              title="Helm"
              icon="info"
              size="20px"
              link="https://helm.sh/docs/"
              linkLabel="View documentation"
              description="Helm helps you manage Kubernetes applications"
            />
          </Styled.FieldPopover>
          <Can I="write" a="modules" isDisabled={isDisabled} passThrough>
            <Styled.Button
              type="submit"
              size="EXTRA_SMALL"
              isLoading={saveLoading || updateStatus === 'pending'}
            >
              {isEdit ? 'Edit module' : 'Create module'}
            </Styled.Button>
          </Can>
        </Styled.Form>
      </FormContext>
    </Styled.Content>
  );
};

export default FormModule;
