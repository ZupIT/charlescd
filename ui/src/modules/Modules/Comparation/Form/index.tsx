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
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useSaveModule, useUpdateModule } from 'modules/Modules/hooks/module';
import { Module } from 'modules/Modules/interfaces/Module';
import { Helm } from 'modules/Modules/interfaces/Helm';
import Can from 'containers/Can';
import { updateParam } from 'core/utils/path';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import routes from 'core/constants/routes';
import isEmpty from 'lodash/isEmpty';
import Components from './Components';
import { component } from './constants';
import {
  createGitApi,
  validFields,
  findGitProvider,
  destructHelmUrl,
  validateSlash
} from './helpers';
import Styled from './styled';
import Select from 'core/components/Form/Select/Single/Select';
import { gitProviders } from 'modules/Settings/Credentials/Sections/CDConfiguration/constants';
import { Option } from 'core/components/Form/Select/interfaces';
import { isRequired } from 'core/utils/validations';

interface Props {
  module: Module;
  onChange: Function;
}

const formDefaultValues = {
  id: '',
  name: '',
  gitRepositoryAddress: '',
  helmRepository: '',
  components: [component]
};

const buildFormDefaultValues = (isEdit: boolean, module: Module) => {
  if (isEdit) {
    return {
      id: module.id,
      name: module.name,
      gitRepositoryAddress: module.gitRepositoryAddress,
      helmRepository: module.helmRepository,
      components: [...module.components]
    };
  } else {
    return formDefaultValues;
  }
};

const FormModule = ({ module, onChange }: Props) => {
  const { loading: saveLoading, saveModule } = useSaveModule();
  const { status: updateStatus, updateModule } = useUpdateModule();
  const isEdit = !isEmpty(module);
  const [isDisabled, setIsDisabled] = useState(true);
  const [helmUrl, setHelmUrl] = useState('');
  const history = useHistory();

  const form = useForm<Module>({
    defaultValues: buildFormDefaultValues(isEdit, module)
  });

  const {
    register: helmRegister,
    getValues: getHelmValues,
    setValue: setHelmValue,
    errors: helmErrors,
    watch: helmWatch
  } = useForm<Helm>({mode: "onChange"});
  const { register, control, getValues, handleSubmit, watch } = form;
  const fieldArray = useFieldArray({ control, name: 'components' });
  const watchFields = watch();
  const watchHelmFields = helmWatch();
  const [helmGitProvider, setHelmGitProvider] = useState<Option>(null);


  useEffect(() => {
    const form = getValues();
    const isInvalid = !validFields(form);
    const mod = {
      name: module?.name,
      gitRepositoryAddress: module?.gitRepositoryAddress,
      helmRepository: module?.helmRepository
    };

    setIsDisabled(isEqual(mod, form) || isInvalid || !!Object.keys(helmErrors).length );
  }, [watchFields, getValues, module, watchHelmFields, helmErrors]);

  useEffect(() => {
    if (updateStatus === 'resolved') {
      onChange();
    }
  }, [updateStatus, onChange]);

  useEffect(() => {
    if (isEdit && !helmGitProvider) {
      const optionGit = findGitProvider(module.helmRepository);
      setHelmGitProvider(optionGit);
      setHelmUrl(module.helmRepository);
    }
  }, [setHelmValue, helmGitProvider, module, setHelmUrl, isEdit]);

  useEffect(() => {
    if (isEdit && helmUrl) {
      destructHelmUrl(module?.helmRepository, helmGitProvider, setHelmValue);
    }
  }, [setHelmValue, helmUrl, helmGitProvider, module, isEdit]);

  const onSubmit = (data: Module) => {
    if (isEdit) {
      updateModule(module?.id, {
        ...data,
        helmRepository: createGitApi(getHelmValues(), helmGitProvider)
      });
    } else {
      saveModule({
        ...data,
        helmRepository: createGitApi(getHelmValues(), helmGitProvider)
      });
    }
  };

  const renderGitHelm = () => (
    <>
      {helmGitProvider.value !== 'GITHUB' && (
        <Styled.FieldPopover>
          <Styled.Input
            label="Insert url"
            name="helmGitlabUrl"
            ref={helmRegister({ required: isRequired(), validate: value => validateSlash(value, "helm gitlab url" ) })}
            error={helmErrors?.helmGitlabUrl?.message}
          />
        </Styled.FieldPopover>
      )}
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert organization"
          name="helmOrganization"
          ref={helmRegister({ required: isRequired(), validate: value => validateSlash(value, "helm organization" ) })}
          error={helmErrors?.helmOrganization?.message}
        />
      </Styled.FieldPopover>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert repository"
          name="helmRepository"
          ref={helmRegister({ required: isRequired(), validate: value => validateSlash(value, "helm repository") })}
          error={helmErrors?.helmRepository?.message}

        />
      </Styled.FieldPopover>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert path (Optional)"
          name="helmPath"
          ref={helmRegister({ validate: value => validateSlash(value, "helm path") })}
          error={helmErrors?.helmPath?.message}

        />
      </Styled.FieldPopover>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert branch (Optional, Default=main)"
          name="helmBranch"
          ref={helmRegister({ validate: value => validateSlash(value, "helm branch") })}
          error={helmErrors?.helmBranch?.message}
        />
      </Styled.FieldPopover>
    </>
  );

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
      <FormProvider {...form}>
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
          <Styled.HelmWrapper>
            <Styled.Title color="light">
              {!isEdit
                ? 'Add helm chart repository'
                : 'Edit helm chart repository'}
            </Styled.Title>
          </Styled.HelmWrapper>
          <Styled.FieldWrapper>
            <Select
              placeholder="Git provider"
              options={gitProviders}
              value={helmGitProvider}
              onChange={option => setHelmGitProvider(option)}
            />
          </Styled.FieldWrapper>
          {helmGitProvider && renderGitHelm()}
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
      </FormProvider>
    </Styled.Content>
  );
};

export default FormModule;
