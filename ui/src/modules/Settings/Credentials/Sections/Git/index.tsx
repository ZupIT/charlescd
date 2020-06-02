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
import isEqual from 'lodash/isEqual';
import Card from 'core/components/Card';
import { Configuration } from 'modules/Workspaces/interfaces/Workspace';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { useGit } from './hooks';
import { FORM_GIT } from './constants';
import FormGit from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: Configuration;
}

const SectionGit = ({ form, setForm, data }: Props) => {
  const [isAction, setIsAction] = useState(true);
  const { responseRemove, loadingRemove, remove } = useGit();

  useEffect(() => {
    setIsAction(true);
  }, [responseRemove]);

  useEffect(() => {
    if (data) setIsAction(false);
  }, [data]);

  const renderSection = () => (
    <Section
      name="Git"
      icon="git"
      showAction={isAction}
      action={() => setForm(FORM_GIT)}
    >
      {data && !responseRemove && (
        <Card.Config
          icon="git"
          description={data.name}
          isLoading={loadingRemove}
          onClose={() => remove(data.id)}
        />
      )}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_GIT) && (
      <Layer action={() => setForm(null)}>
        <FormGit onFinish={() => setForm(null)} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionGit;
