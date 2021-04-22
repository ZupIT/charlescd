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

import { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  destructHelmUrl,
  validateSlash
} from './helpers';
import Styled from './styled';
import { isNotBlank, isRequired, isRequiredAndNotBlank, maxLength, urlPattern } from 'core/utils/validations';
import { getWorkspace } from 'core/utils/workspace';

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
  const history = useHistory();
  const isEditing = !isEmpty(module);
  const { loading: saveLoading, saveModule } = useSaveModule();
  const { status: updateStatus, updateModule } = useUpdateModule();

  const form = useForm<Module>({
    defaultValues: buildFormDefaultValues(isEditing, module),
    mode: 'onChange'
  });

  const {
    register: helmRegister,
    getValues: getHelmValues,
    setValue: setHelmValue,
    errors: helmErrors,
    formState: { isValid: isHelmValid }
  } = useForm<Helm>({ mode: 'onChange' });
  const { register, control, handleSubmit, formState: { isValid }, errors } = form;
  const fieldArray = useFieldArray({ control, name: 'components', keyName: 'fieldId' });
  const workspace = getWorkspace();
  const helmGitProvider = workspace?.deploymentConfiguration?.gitProvider;

  useEffect(() => {
    if (updateStatus === 'resolved') {
      onChange();
    }
  }, [updateStatus, onChange]);

  useEffect(() => {
    if (isEditing) {
      destructHelmUrl(module?.helmRepository, helmGitProvider, setHelmValue);
    }
  }, [setHelmValue, helmGitProvider, module, isEditing]);

  const onSubmit = (data: Module) => {
    const payload = {
      ...data,
      helmRepository: createGitApi(getHelmValues(), helmGitProvider)
    };

    if (isEditing) {
      updateModule(module?.id, payload);
    } else {
      saveModule(payload);
    }
  };

  const renderGithub = () => (
    <Fragment>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert organization"
          name="helmOrganization"
          ref={helmRegister({ ...isRequiredAndNotBlank, validate: value => validateSlash(value, "helm organization") })}
          error={helmErrors?.helmOrganization?.message}
        />
      </Styled.FieldPopover>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert repository"
          name="helmRepository"
          ref={helmRegister({ ...isRequiredAndNotBlank, validate: value => validateSlash(value, "helm repository") })}
          error={helmErrors?.helmRepository?.message}
        />
      </Styled.FieldPopover>
    </Fragment>
  );

  const renderGitlab = () => (
    <Styled.FieldPopover>
      <Styled.Input
        label="Insert Project ID"
        name="helmProjectId"
        ref={helmRegister({ ...isRequiredAndNotBlank, validate: value => validateSlash(value, "helm projectid") })}
        error={helmErrors?.helmProjectId?.message}
      />
    </Styled.FieldPopover>
  );

  const renderGitHelm = () => (
    <Fragment>
      <Styled.Helm>
        <Styled.Title color="light">
          {!isEditing
            ? 'Add helm chart repository'
            : 'Edit helm chart repository'}
        </Styled.Title>
      </Styled.Helm>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert url"
          name="helmUrl"
          ref={helmRegister({ ...isRequiredAndNotBlank, validate: value => validateSlash(value, "helm url") })}
          error={helmErrors?.helmUrl?.message}
        />
      </Styled.FieldPopover>
      {helmGitProvider === 'GITHUB' ? renderGithub() : renderGitlab()}
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert path (Optional)"
          name="helmPath"
          ref={
            helmRegister({ validate: {
              slash: value => validateSlash(value, "helm path"),
              notBlack: isNotBlank
            }})
          }
          error={helmErrors?.helmPath?.message}
        />
      </Styled.FieldPopover>
      <Styled.FieldPopover>
        <Styled.Input
          label="Insert branch (Optional, Default=main)"
          name="helmBranch"
          ref={
            helmRegister({ validate: {
              slash: value => validateSlash(value, "helm branch"),
              notBlack: isNotBlank
            }})
          }
          error={helmErrors?.helmBranch?.message}
        />
      </Styled.FieldPopover>
    </Fragment>
  );

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
            ref={register({ required: true })}
          />
          <Styled.Input
            label="URL git"
            name="gitRepositoryAddress"
            defaultValue={module?.gitRepositoryAddress}
            ref={register({
              required: isRequired(),
              maxLength: maxLength(1048),
              pattern: urlPattern(),
            })}
            error={errors?.gitRepositoryAddress?.message}
          />
          {!isEditing && <Components key="components" fieldArray={fieldArray} />}
          {helmGitProvider && renderGitHelm()}
          <Can I="write" a="modules" isDisabled={!isValid || !isHelmValid} passThrough>
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
