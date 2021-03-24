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
import map from 'lodash/map';
import xor from 'lodash/xor';
import ContentIcon from 'core/components/ContentIcon';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { Actions, Subjects, actions, subjects } from 'core/utils/abilities';
import Styled from './styled';
import { actionTemplate, displayAction, subjectTemplate } from './helpers';
import { useFormContext } from 'react-hook-form';

const Scopes = () => {
  const { register, setValue, getValues } = useFormContext();

  console.log('SCOPE');

  const onChangeSubject = (subject: Subjects) => {
    const { permissions } = getValues();
    const newPermissions = [`${subject}_write`, `${subject}_read`];
    setValue('permissions', xor(permissions, newPermissions));
  }

  const onChangeAction = (action: Actions, subject: Subjects, checked: boolean) => {
    const { permissions } = getValues();
    if (action === 'write') {
      const permission = [`${subject}_read`];
      setValue('permissions', xor(permissions, permission));
    }
  }

  const renderActions = (subject: Subjects) => (
    map(actions, (action: Actions) => (
      <Styled.Content left displayAction={displayAction(subject)} key={`${subject}_${action}`}>
        <Form.Checkbox
          label={action}
          ref={register()}
          name="permissions"
          value={`${subject}_${action}`}
          onChange={(checked: boolean) => onChangeAction(action, subject, checked)}
          description={actionTemplate(action, subject)}
        />
      </Styled.Content>
    ))
  )

  const renderSubjects = () =>
    map(subjects, (subject, index: number) => (
      <React.Fragment key={subject}>
        <Form.Checkbox
          name="subjects"
          label={subject}
          ref={register()}
          value=""
          onChange={() => onChangeSubject(subject)}
          description={subjectTemplate(subject)}
        />
        {renderActions(subject)}
      </React.Fragment>
    ));

  return (
    <ContentIcon icon="scopes">
      <Text.h2 color="light">Scopes</Text.h2>
      <Styled.Content>
        {renderSubjects()}
      </Styled.Content>
    </ContentIcon>
  )
}

export default Scopes;
