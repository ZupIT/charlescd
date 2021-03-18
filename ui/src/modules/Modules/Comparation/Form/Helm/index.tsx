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
import { Fragment, memo, useState } from 'react';
// import isEmpty from 'lodash/isEmpty';
import useForm from 'core/hooks/useForm';
import { Option } from 'core/components/Form/Select/interfaces';
import { gitProviders } from 'modules/Settings/Credentials/Sections/DeploymentConfiguration/constants';
import Select from 'core/components/Form/Select/Single/Select';
// import { Module } from 'modules/Modules/interfaces/Module';
// import { isRequiredAndNotBlank } from 'core/utils/validations';
import Styled from './styled';
import { GitHelm } from 'modules/Modules/interfaces/Helm';

// interface Props {
//   module: Module;
//   form: UseFormMethods<Module>;
// };

const Helm = () => {
  console.log('Helm');
  // const { register, errors } = form;
  const isEditing = false;
  const [gitProvider, setGitProvider] = useState<string>('GITHUB');
  const isGithub = gitProvider === 'GITHUB';
  const { register } = useForm<GitHelm>({ mode: 'onBlur' });

  // const onSubmit = () => {
  //   console.log('onSubmit')
  // };

  const Form = () => (
    <Styled.Fields>
      <Styled.Input
        label="Base URL"
        name="baseUrl"
        ref={register()}
      />
      {isGithub ? <Github /> : <Gitlab />}
      <Styled.Input
        label="Path (Optional)"
        name="path"
        ref={register()}
      />
      <Styled.Input
        label="Branch (e.g. main)"
        name="branch"
        ref={register()}
      />
    </Styled.Fields>
  );

  const Github = () => (
    <Fragment>
      <Styled.Input
        label="Organization (e.g. zupit)"
        name="organization"
        ref={register()}
      />
      <Styled.Input
        label="Repository"
        name="repository"
        ref={register()}
      />
    </Fragment>
  );

  const Gitlab = () => (
    <Styled.Input
      label="Project ID (e.g. 987123)"
      name="projectId"
      ref={register()}
    />
  );

  return (
    <Styled.Helm>
      <Styled.Title color="light">
        {!isEditing
          ? 'Add helm chart repository'
          : 'Edit helm chart repository'}
      </Styled.Title>
      <Styled.Fields>
        {/* <Select
          placeholder="Git provider"
          options={gitProviders}
          value={gitProvider}
          onChange={option => setGitProvider(option)}
        /> */}
        {gitProvider && <Form />}
      </Styled.Fields>
    </Styled.Helm>
  )
}

export default memo(Helm);