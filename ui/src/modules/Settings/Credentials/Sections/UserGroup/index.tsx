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

import React, { useState } from 'react';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import filter from 'lodash/filter';
import Card from 'core/components/Card';
import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { getWorkspaceId } from 'core/utils/workspace';
import { useUserGroup } from './hooks';
import { FORM_USER_GROUP } from './constants';
import FormUserGroup from './Form';

interface Props {
  form: string;
  setForm: Function;
  data: UserGroup[];
}

const SectionUserGroup = ({ form, setForm, data }: Props) => {
  const [userGroups, setUserGroups] = useState(data);
  const { remove, loadingRemove } = useUserGroup();

  const handleClose = async (id: string) => {
    await remove(getWorkspaceId(), id);
    setUserGroups(filter(userGroups, item => item.id !== id));
  };

  const renderSection = () => (
    <Section
      name="User group"
      icon="users"
      showAction
      action={() => setForm(FORM_USER_GROUP)}
    >
      {userGroups &&
        map(userGroups, userGroup => (
          <Card.Config
            key={userGroup.name}
            icon="users"
            description={userGroup.name}
            isLoading={loadingRemove}
            onClose={() => handleClose(userGroup?.id)}
          />
        ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_USER_GROUP) && (
      <Layer action={() => setForm(null)}>
        <FormUserGroup onFinish={() => setForm(null)} />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionUserGroup;
